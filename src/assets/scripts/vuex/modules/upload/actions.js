const fsm = require('@nativescript/core/file-system');

import {
    clear_upload_completed_delay,
    maximum_upload_retry_count,
} from "../../../constants";
import {increment_upload_retry_count, set_state_data, set_upload_data} from "../../mutation-types";

let timeOut = null;
let table = null;
let cancelTimeOut = 0;
let lookup = 0;
const lookup_interval = 3600;
const times = { immediate:750,short:2000,normal:5000,long:15000,far:90000 };
const timer = require('@nativescript/core/timer');
let TaskResponded,TaskError,TaskCancel,Keep;

export function init(ctx) {
    table = ctx.getters.table; TaskResponded = _.bind(taskResponded,ctx); TaskError = _.bind(taskError,ctx); TaskCancel = _.bind(taskCancel,ctx); Keep = _.bind(keep,ctx);
    timer.setTimeout(() => ctx.dispatch('clearCompleted'),clear_upload_completed_delay * 1000);
    DB.get(table,{ progress:ctx.state.enums.ADDED },function({commit,dispatch}){
        if(!this.error && this.result.length !== 0) commit(set_state_data,{ key:'latest',value:_.get(_.last(this.result),'id',0) });
        return dispatch('processQueue');
    },ctx)
}

export function activityUpload({ getters,dispatch },activity) {
    let Activity = Array.isArray(activity) ? activity : [activity], tables = getters.tables;
    let payload = Activity.filter(({ table }) => (_.has(tables, table) && tables[table].direction !== 'download'));
    if(payload.length > 0) dispatch('add',payload);
}

export function add(ctx,activity){
    let Activity = Array.isArray(activity) ? activity : [activity];
    if(Activity.length === 0) return; let tables = ctx.getters.tables;
    Activity.forEach(activity => {
        (_.has(tables,activity.table)
            && tables[activity.table].direction !== 'download'
            && activity.data.length > 0) ? Keep(activity.table,JSON.stringify([activity])) : null
    })
}

export function processQueue({ state,dispatch,commit,rootState }) {
    if(timeOut) timer.clearTimeout(timeOut);
    if(!rootState['Connection'].status) return timeOut = timer.setTimeout(dispatch ,times.long, 'processQueue');
    if(state.processing) return timeOut = timer.setTimeout(dispatch,times.normal,'processQueue');
    if(!state.latest || state.completed < state.latest || state.reset.length){
        commit(set_state_data,{ key:'processing',value:true });
        dispatch('doProcessQueue');
    } else if((__.now() - lookup) > lookup_interval){
        DB.get(table,{ progress:state.enums.ADDED },function(commit){
            if(_.isEmpty(this.result)) return;
            _.forEach(this.result,({ id }) => commit('addReset',id))
        },commit);
        lookup = __.now();
    }
}

export function doProcessQueue({ state,dispatch,commit }) {
    DB.get(table,{ progress:state.enums.ADDED },function(dispatch,commit){
        if(_.isEmpty(this.result)) return commit(set_state_data,[{ key:'processing',value:null }]);
        let data = this.result[0], id = data['id'];
        commit(set_state_data,[{ key:'retry_count',value:0 },{ key:'processing',value:id },{ key:'init_time',value:__.now() }]);
        commit(set_upload_data,data); update(id,'considered');
        dispatch('upload',data);
    },dispatch,commit)
}

export function upload(ctx,data){
    timer.clearTimeout(cancelTimeOut);

    let task = Uploader.session('activity-upload-'+data['id']).multipartUpload(getParams(data),getRequest(data))

    task.on('responded',response => TaskResponded(task,data,response));
    task.on('error',response => TaskError(task,data,response));
    task.on('cancel',response => TaskCancel(task,data,response));

    cancelTimeOut = timer.setTimeout(task => task.cancel(),times.far,task);
}

export function reset({ dispatch },id){
    update(id,'reset');
    dispatch('processQueue');
}

export function clearCompleted({ state,dispatch }) {
    DB.delete(table,[{ progress:state.enums.RESPONDED,status:state.enums.SUCCESS },{ updated_at:__.now()-3600,operator:'<' }],function(){
        if(this.error) log('Clearing completed uploads failed');
        timer.setTimeout(dispatch,clear_upload_completed_delay*1000,'clearCompleted');
    });
}

const updates = {
    considered: { progress:1,status:1,considered:0 },
    success: { progress:2,status:2,responded:0 },
    failed: { progress:2,status:4,responded:0 },
    retry: { progress:2,status:3,response:0 },
    reset: { progress:0,status:0,response:0 },
};
const updates_extra = {
    considered:'considered',
    success:'responded',
    failed:'responded',
    retry:'response',
    reset:'response',
};
function update(id,action){
    let data = _.set(_.cloneDeep(updates[action]),updates_extra[action],__.now());
    DB.update(table,id,data);
}

const requestData = { method: 'post', headers: { "Content-Type": "application/octet-stream" },
    androidDisplayNotificationProgress: true, androidAutoDeleteAfterUpload: true,
    androidAutoClearNotification: true, androidNotificationTitle: 'Synchronizing' };
function getRequest({ url,id }) {
    return { url,description:id,...requestData }
}
const format = 'json', type = 'data', mimeType = "application/json";
function getParams({ user,uuid,content }){
    let params = { _user:user,uuid,format,type };
    return _.map(params,(value,name) => _.zipObject(['name','value'],[name,value])).concat({
        filename: content,
        name: 'file',
        mimeType
    })
}

function taskResponded(task,stateData,{ data }){
    timer.clearTimeout(cancelTimeOut); let id = task.description; update(id,'success');
    if(typeof(data) === 'string' && data.trim() !== '' && data.trim().substr(0,1) === '['){
        try {
            let parsed = JSON.parse(data.trim()); this.dispatch('Sync/doProcessSyncData',parsed,{ root:true });
        } catch(e){
            log('Error in parsing activities of uploaded response: ' + stateData['url'],data);
        }
    } else if(typeof(data) === 'object' && Array.isArray(data)){
        this.dispatch('Sync/doProcessSyncData',data,{ root:true });
    }
    commitCompleted(id,this.commit,this.dispatch);
}

function taskError(task,data,{ responseCode }){
    timer.clearTimeout(cancelTimeOut); let id = task.description; update(id,'failed');
    if([408,429,503,504].includes(responseCode) && maximum_upload_retry_count > this.state.retry_count)
        return timer.setTimeout(() => {
            this.commit(increment_upload_retry_count);
            this.dispatch('upload',data);
            update(id,'retry');
        },times.short);
    commitCompleted(id,this.commit,this.dispatch)
}

function taskCancel(task,data){
    timer.clearTimeout(cancelTimeOut);
    if((__.now() - this.state.init_time) >= (2 * times.far)){
        let id = task.description;
        commitCompleted(id,this.commit,this.dispatch);
        update(id,'failed');
    }
    timer.setTimeout(() => this.dispatch('upload',data),times.short);
}

function commitCompleted(id,commit,dispatch){
    commit(set_state_data,[{ key:'processing',value:null },{ key:'completed',value:id }]);
    commit('remReset',id);
    timer.setTimeout(dispatch,times.short,'processQueue');
}

function keep(aTable,content){
    let file = fsm.knownFolders.temp().getFolder('tblUpd').getFile([__.now(),aTable,'json'].join('.'));
    let url = this.getters.url(aTable), uuid = this.rootGetters.uuid, user = this.rootGetters.user,
        progress = this.state.enums.ADDED, status = this.state.enums.NEW, added = __.now();
    file.writeText(typeof(content) === 'string' ? content.trim() : JSON.stringify(content).trim())
        .then(() => {
            DB.insert(table,{ url,uuid,user,content:file.path,progress,added,status },function(table,commit,mutation,dispatch){
                DB.getAllQuery(`SELECT id FROM ${table} ORDER BY id DESC LIMIT 1`,function(commit,mutation,dispatch){
                    if(!this.result || !this.result[0] || !this.result[0]['id']) return;
                    commit(mutation,{ key:'latest',value:this.result[0]['id'] });
                    dispatch('processQueue')
                },[commit,mutation,dispatch])
            },table,this.commit,set_state_data,this.dispatch)
        })
        .catch(e => log('Error while trying to write activity content to cache'));
}
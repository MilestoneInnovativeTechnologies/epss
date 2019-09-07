import {
    maximum_upload_processing_time,
    maximum_upload_retry_count,
} from "../../../constants";
import {increment_upload_retry_count, set_state_data, set_upload_data} from "../../mutation-types";

let timeOut = null;

export function init({ dispatch,getters,state,commit }) {
    DB.get(getters.table,{ progress:state.enums.ADDED },function(commit,dispatch){
        if(!this.error && this.result.length !== 0) commit(set_state_data,{ key:'latest',value:_.get(_.last(this.result),'id') });
        return dispatch('processQueue');
    },commit,dispatch)
}

export function activityUpload({ getters,dispatch },activity) {
    let Activity = Array.isArray(activity) ? activity : [activity], tables = getters.tables;
    let payload = Activity.filter(({ table }) => (_.has(tables, table) && tables[table].direction !== 'download'));
    if(payload.length > 0) dispatch('add',payload);
}

export function add({ getters,dispatch },activity){
    let Activity = Array.isArray(activity) ? activity : [activity];
    if(Activity.length === 0) return; let tables = getters.tables;
    Activity.forEach((activity) => {
        if(!_.has(tables, activity.table) || tables[activity.table].direction === 'download' || activity.data.length === 0) return ;
        let activityArray = [activity], stringify = JSON.stringify(activityArray), content = base64Encode(stringify).replace(/\r?\n|\r/g,'');
        dispatch('prepare',{ table:activity.table,content:content });
    })
}

export function prepare({ state,getters,rootGetters,dispatch }, {table, content}) {
    let url = getters.url(table), uuid = rootGetters.uuid, user = rootGetters.user, onsuccess = "uploadSuccessResponse", onfail = "uploadFailure", progress = state.enums.ADDED, status = state.enums.NEW, added = __.now();
    dispatch('insert',{ url,uuid,user, content, onsuccess, onfail, progress, added, status })
}

export function insert({ getters,dispatch,commit },data) {
    dispatch('_insert',{ table:getters.table,data },{ root:true }).then(activity => {
        let id = _.get(_.last(activity.data),'id');
        commit(set_state_data,{ key:'latest',value:id });
        dispatch('processQueue');
    },{ root:true })
}

export function processQueue({ state,dispatch,commit }) {
    if(timeOut) clearTimeout(timeOut);
    if(state.processing){
        if(considerFailed(state.init_time)) return dispatch('makeProcessingFailed');
        timeOut = setTimeout(function(dispatch){ dispatch('processQueue') },5000,dispatch);
    } else {
        if(state.completed < state.latest){
            commit(set_state_data,{ key:'processing',value:true });
            dispatch('doProcessQueue');
        }
    }
}

export function doProcessQueue({ getters,state,dispatch,commit }) {
    DB.get(getters.table,{ progress:state.enums.ADDED },function(dispatch,commit){
        let data = this.result[0];
        commit(set_upload_data,data);
        commit(set_state_data,{ key:'retry_count', value:0 });
        dispatch('doPost');
    },dispatch,commit)
}

export function uploadSuccessResponse({ dispatch,commit }, response) {
    dispatch('setResponse',{ type:'SUCCESS',response });
    dispatch('Sync/doProcessSyncData',response,{ root:true }).then(() => {
        commit(set_state_data,{ key:'processing',value:null });
        dispatch('processQueue');
    })
}
export function uploadFailure({ dispatch }) {
    dispatch('setResponse',{ type:'FAILED',response:null });
    dispatch('retryFailed');
}

export function retryFailed({ dispatch,commit,state,getters }) {
    if(state.retry_count > maximum_upload_retry_count) return dispatch('maxRetryExhausted');
    dispatch('doPost'); DB.update(getters.table,state.uData.id,{ status:state.enums.RETRY },function(commit){
        commit(increment_upload_retry_count);
    },commit)
}

export function setResponse({ state,getters,commit },{ type,response }) {
    let id = state.processing, progress = state.enums.RESPONDED, status = state.enums[type], responded = __.now();
    let data = { progress,status,responded,response };
    DB.update(getters.table,id,data,function(commit,id){
        commit(set_state_data,{ key:'completed',value:id })
    },commit,id);
}

export function doPost({ dispatch,getters,state,commit }) {
    let data = state.uData;
    dispatch('post',data,{ root:true }).then(() => {
        let update = { progress:state.enums.CONSIDERED,status:state.enums.PROCESSING,considered:__.now()  };
        DB.update(getters.table,data.id,update,function(commit,id){
            commit(set_state_data,{ key:'processing',value:id });
            commit(set_state_data,{ key:'init_time',value:__.now() });
        },commit,data.id)
    });
}

export function maxRetryExhausted({ state,commit,dispatch }) {
    log('Upload failed',state.uData.url);
    commit(set_state_data,{ key:'processing', value:false });
    dispatch('processQueue');
}

export function makeProcessingFailed({ dispatch }) {
    dispatch('uploadFailure');
}

function base64Encode(value) {
    let text = new java.lang.String(value);
    let data = text.getBytes("UTF-8");
    return android.util.Base64.encodeToString(data, android.util.Base64.DEFAULT);
}

function considerFailed(time) {
    if(time === null) return false;
    if((__.now() - time) >= maximum_upload_processing_time) return true;
    return false;
}
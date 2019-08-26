import {
    maximum_upload_retry_count,
} from "../../../constants";
import {increment_upload_retry_count, set_state_data} from "../../mutation-types";


export function init(context) {

}

export function add({ getters },activity){
    let Activity = Array.isArray(activity) ? activity : [activity];
    if(Activity.length === 0) return; let tables = getters.tables;
    Activity.forEach((activity) => {
        if(!_.has(tables, activity.table) || tables[activity.table].direction === 'download' || activity.data.length === 0) return;
        dispatch('prepare',{ table:activity.table,content:base64Encode(JSON.stringify(activity)) });
    })
}

export function prepare({ state,getters,rootGetters }, {table, content}) {
    let url = getters.url(table), params = getUploadParams(rootGetters), onsuccess = 'uploadSuccessResponse', onfail = 'uploadFailure', progress = state.enums.ADDED, status = state.enums.NEW, added = __.now();
    dispatch('insert',{ url,params, content, onsuccess, onfail, progress, added, status })
}

export function insert({ getters,dispatch,commit },data) {
    dispatch('_insert',{ table:getters.table,data }).then(activity => {
        commit(_.get(_.last(activity.data),'id'));
        dispatch('processQueue');
    },{ root:true })
}

export function processQueue({ state,dispatch,commit }) {
    if(!state.processing && state.completed < state.latest){
        commit(set_state_data,{ key:'processing',value:true });
        dispatch('doProcessQueue');
    }
}

export function doProcessQueue({ getters,state,dispatch,commit }) {
    DB.get(getters.table,{ status:state.enums.NEW },function(dispatch,commit){
        let data = this.result[0];
        commit(set_state_data,{ key:'data', value:data });
        commit(set_state_data,{ key:'retry_count', value:0 });
        dispatch('doPost',data);
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
    dispatch('doPost',state.data); DB.update(getters.table,state.data.id,{ status:state.enums.RETRY },function(commit){
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

export function doPost({ dispatch,getters,state,commit },data) {
    let { url,params,onsuccess:success,onfail:fail } = data; params.content = data.content;
    dispatch('post',{ url,params,success,fail },{ root:true }).then(() => {
        let update = { progress:state.enums.CONSIDERED,status:state.enums.PROCESSING,considered:__.now()  };
        DB.update(getters.table,data.id,update,function(commit,id){
            commit(set_state_data,{ key:'processing',value:id });
            commit(set_state_data,{ key:'init_time',value:__.now() });
        },commit,data.id)
    });
}

export function maxRetryExhausted({ state,commit,dispatch }) {
    log('Upload failed',state.data.url);
    commit(set_state_data,{ key:'processing', value:false });
    dispatch('processQueue');
}

function base64Encode(value) {
    let text = new java.lang.String(value);
    let data = text.getBytes("UTF-8");
    return android.util.Base64.encodeToString(data, android.util.Base64.DEFAULT);
}

function getUploadParams(rGetters) {
    return { format: 'json',  type: 'data', _user:rGetters.user, client:rGetters.client }
}
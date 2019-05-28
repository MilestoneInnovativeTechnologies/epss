import { table_information_db_table_name,sync_recheck_timeout_seconds } from './../../constants';
import {
    add_new_app_table,
    add_to_app_sync_queue,
    processing_queue,
    finish_processing_queue,
    update_last_sync_time,
} from './../../mutation-types';

export function deleteClient({ dispatch,state,rootGetters }) {
    let client = rootGetters['Organization/client'],
        url = state.url.replace(client+'/','delete'),
        params = { client };
    dispatch('post',{ url,params },{ root:true });
}

export async function AppSync({ dispatch }) {
    await dispatch('AppSyncPrepare');
    await dispatch('doSyncProcess');
}

export function AppSyncPrepare({ commit,state }){
    return DB.get(table_information_db_table_name,{ type:'APP' },function(commit,state){
        _.forEach(this.result,(tblObj) => {
            commit(add_new_app_table,tblObj);
            let at = now() + state.app_sync_start_after;
            commit(add_to_app_sync_queue,{ table:tblObj.table,at })
        })
    },commit,state)
}

export function doSyncProcess({ getters,dispatch,commit }){
    log('doSyncProcess called');
    if(!getters.haveQueueEarlierThan(now()) || !getters.canStartProcessingQueue) return setTimeout(function(dispatch){ dispatch('doSyncProcess'); },sync_recheck_timeout_seconds*1000,dispatch);
    commit(processing_queue,getters.getFirstQueueItem);
    dispatch('doStartSyncProcessing')
}

export function doStartSyncProcessing({ state,dispatch,commit }){
    let { table,type } = state.processing;
    let action = 'prepareSyncTable_'+type;
    dispatch(action,table);
    //commit(set_repeat_failed_timeout,setTimeout((dispatch) => dispatch('doStartSyncProcessing'),state.repeat_failed_processing_seconds*1000,dispatch));
}

export function prepareSyncTable_APP({ dispatch,getters },table){
    let params = { format: 'json',  type: 'data' },
        url = getters.getTableSyncUrl(table);
    dispatch('post',{ url,params,success:'Sync/syncDataReceived_App' },{ root:true });
}

export function prepareSyncTable_APPUSER({ dispatch,getters },table){
    let params = { format: 'json',  type: 'data', created_at:'2000-01-01 00:00:01' },
        url = getters.getTableSyncUrl(table);
    dispatch('post',{ url,params,success:'Sync/syncDataReceived_App' },{ root:true });
}

export function prepareSyncTable_USER(context,table){

}

export function syncDataReceived_App({ commit,dispatch },data){
    if(!_.isEmpty(data)) dispatch('processSyncReceivedData',data);
    commit(finish_processing_queue);
    setTimeout(function(dispatch){ dispatch('doSyncProcess') },sync_recheck_timeout_seconds*1000,dispatch)
}

export function processSyncReceivedData({ commit },data) {
    _.forEach(data,(activity) => {
        let table = activity.table, mode = activity.mode, fun = mode + 'Records';
        eval(fun).call(null,table,activity.data);
        commit(update_last_sync_time,{ table,time:now() })
    })
}


function now(){ return parseInt(new Date().getTime()/1000); }
function updateRecords(table,records){ _.forEach(records,(record) => { DB.update(table,record.id,record); }); }
function createRecords(table,records){ DB.insert(table,records); }



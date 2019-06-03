import { table_information_db_table_name,sync_recheck_timeout_seconds } from './../../constants';
import {
    add_new_table_for_sync,
    add_to_app_sync_queue,
    processing_queue,
    finish_processing_queue,
    update_table_timing
} from './../../mutation-types';

export function init({ dispatch }) {
    dispatch('doSyncProcess');
}

export function deleteClient({ dispatch,state,rootGetters }) {
    let client = rootGetters['Organization/client'],
        url = state.url.replace(client+'/','delete'),
        params = { client };
    dispatch('post',{ url,params },{ root:true });
}

export function downloadTableRecords({ commit,state,dispatch },table){
    return DB.get(table_information_db_table_name,{ table },function(commit,state,dispatch){
        _.forEach(this.result,(tblObj) => {
            commit(add_new_table_for_sync,tblObj);
            let at = now() + state.app_sync_start_after;
            commit(add_to_app_sync_queue,{ table:tblObj.table,type:tblObj.type,at });
        })
    },commit,state,dispatch)
}

// export function AppSyncPrepare({ commit,state }){
//     return DB.get(table_information_db_table_name,{ type:'APP' },function(commit,state){
//         _.forEach(this.result,(tblObj) => {
//             commit(add_new_table_for_sync,tblObj);
//             let at = now() + state.app_sync_start_after;
//             commit(add_to_app_sync_queue,{ table:tblObj.table,at })
//         })
//     },commit,state)
// }

export function doSyncProcess({ getters,dispatch,commit }){
    if(!getters.haveQueueEarlierThan(now()) || !getters.canStartProcessingQueue) return setTimeout(function(dispatch){ dispatch('doSyncProcess'); },sync_recheck_timeout_seconds*1000,dispatch);
    log('Start processing a queue item');
    commit(processing_queue,getters.getFirstQueueItem);
    dispatch('doStartSyncProcessing')
}

export function doStartSyncProcessing({ state,dispatch }){
    let { table,type } = state.processing;
    let action = 'prepareSyncTable_'+type;
    log('Syncing for table, '+table);
    dispatch(action,table);
}

export function prepareSyncTable_APP({ dispatch,getters },table){
    let params = { format: 'json',  type: 'data' },
        url = getters.getTableSyncUrl(table);
    log('Sync request delivered for, '+table);
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
    log('Syncing data received');
    if(!_.isEmpty(data)) dispatch('processSyncReceivedData',data);
    log('Finishing process queue'); commit(finish_processing_queue);
    setTimeout(function(dispatch){ dispatch('doSyncProcess') },sync_recheck_timeout_seconds*1000,dispatch)
}

export function processSyncReceivedData({ commit,dispatch },data) {
    _.forEach(data,(activity) => {
        let table = activity.table, mode = activity.mode, type = mode + 'Records',
            payload = { type, table, records:activity.data };
        dispatch(payload); commit(update_table_timing,{ table,type:'sync',time:now() });
    })
}

export function requeueSync({ state,commit },table) {
    let { type,up,down } = _.pick(state.table[table],['type','up','down']);
    if(type === 'APP' || type === 'APPUSER') commit(add_to_app_sync_queue,{ table,type,at:now()+down });
    if(type === 'USER') commit(add_to_app_sync_queue,{ table,type,at:now()+up });
}

export function updateRecords({ commit }, {table, records}) {
    let lastRecIndex = records.length - 1; if(lastRecIndex < 1) return;
    _.forEach(records,(record,idx) => {
        DB.update(table,record.id,record);
        if(idx !== lastRecIndex) return;
        commit(update_table_timing,{ table,type:'local',time:now() }) });
}

export function createRecords({ commit }, {table, records}) {
    if(records.length < 1) return;
    DB.insert(table,records,function(commit,table){
        commit(update_table_timing,{ table,type:'local',time:now() })
    },commit,table);
}

function now(){ return parseInt(new Date().getTime()/1000); }
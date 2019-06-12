import { table_information_db_table_name,sync_recheck_timeout_seconds } from './../../constants';
import {
    add_new_table_for_sync,
    add_to_app_sync_queue,
    processing_queue,
    finish_processing_queue,
    update_table_timing, set_new_sync_time_out
} from './../../mutation-types';

export function init({ dispatch,commit }) {
    DB.get(table_information_db_table_name,null,function (commit,dispatch) {
        _.forEach(this.result,function (tblObj) {
            commit(add_new_table_for_sync,tblObj);
            let at = now() + _.toSafeInteger(_.min([tblObj.up,tblObj.down])) + 11;
            commit(add_to_app_sync_queue,{ table:tblObj.table,type:tblObj.type,at });
        });
        dispatch('doSyncProcess')
    },commit,dispatch)
}

export function deleteClient({ dispatch,state,rootGetters }) {
    let client = rootGetters['Organization/client'],
        url = state.url.replace(client+'/','delete'),
        params = { client };
    dispatch('post',{ url,params },{ root:true });
}

export function downloadTableRecords({ commit,dispatch },table){
    return DB.get(table_information_db_table_name,{ table },function(commit,dispatch){
        _.forEach(this.result,(tblObj) => {
            commit(add_new_table_for_sync,tblObj);
            dispatch('requeueSync',tblObj.table);
            // let at = now() + state.app_sync_start_after;
            // commit(add_to_app_sync_queue,{ table:tblObj.table,type:tblObj.type,at });
        })
    },commit,dispatch)
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
    if(!getters.haveQueue) return ; let cTime = now();
    if (getters.haveQueueEarlierThan(cTime)){
        if (getters.canStartProcessingQueue) {
            log('Start processing a queue item');
            commit(processing_queue,getters.getFirstQueueItem);
            dispatch('doStartSyncProcessing')
        } else {
            commit(set_new_sync_time_out,setTimeout(function(dispatch){ dispatch('doSyncProcess'); },sync_recheck_timeout_seconds*1000,dispatch));
        }
    } else {
        let nTime = _.toSafeInteger(getters.getFirstQueueItem.index);
        let rTime = nTime - cTime;
        commit(set_new_sync_time_out,setTimeout(function(dispatch){ dispatch('doSyncProcess'); },rTime*1000,dispatch));
    }
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
    dispatch('post',{ url,params,success:'Sync/syncDataReceived',fail:'Sync/syncDataFail' },{ root:true });
}

export function prepareSyncTable_APPUSER({ dispatch,getters,state },table){
    let params = { format: 'json',  type: 'data', _user:state.user, _client:state.client },
        url = getters.getTableSyncUrl(table);
    dispatch('post',{ url,params,success:'Sync/syncDataReceived',fail:'Sync/syncDataFail' },{ root:true });
}

export function prepareSyncTable_USER({ dispatch,getters,state },table){
    let params = { format: 'json',  type: 'data', _user:state.user, _client:state.client },
        url = getters.getTableSyncUrl(table);
    dispatch('post',{ url,params,success:'Sync/syncDataReceived',fail:'Sync/syncDataFail' },{ root:true });
}

export function syncDataReceived({ commit,dispatch,state },data){
    let table = state.processing.table;
    log('Syncing data received for, ' + table);
    if(!_.isEmpty(data)) dispatch('processSyncReceivedData',data);
    log('Finishing process queue, ' + table); commit(finish_processing_queue);
    commit(set_new_sync_time_out,setTimeout(function(dispatch){ dispatch('doSyncProcess') },sync_recheck_timeout_seconds * 1000,dispatch));
    dispatch('requeueSync',table);
}
export function syncDataFail({ commit,dispatch,state },data){
    let table = state.processing.table;
    log('Syncing failed for, ' + table);
    log('Finishing process queue, ' + table); commit(finish_processing_queue);
    commit(set_new_sync_time_out,setTimeout(function(dispatch){ dispatch('doSyncProcess') },sync_recheck_timeout_seconds * 1000,dispatch));
    dispatch('requeueSync',table);
}

export function processSyncReceivedData({ commit,dispatch },data) {
    _.forEach(data,(activity) => {
        let table = activity.table, mode = activity.mode, type = mode + 'Records',
            payload = { type, table, records:activity.data };
        dispatch(payload); commit(update_table_timing,{ table,type:'sync',time:now() });
    })
}

export function requeueSync({ state,commit },table) {
    let { type,up,down } = _.pick(state.tables[table],['type','up','down']);
    let at = now() + ((type === 'APP' || type === 'APPUSER') ? _.toSafeInteger(down) : _.toSafeInteger(up));
    commit(add_to_app_sync_queue,{ table,type,at });
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
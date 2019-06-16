import {
    table_information_db_table_name, sync_recheck_timeout_seconds,
    app_user_create_date_for_fetch, setup_sync_table_after, init_sync_table_after, init_sync_user_table_after
} from './../../constants';
import {
    add_new_table_for_sync, add_to_app_sync_queue,
    processing_queue, finish_processing_queue,
    update_table_timing, set_new_sync_time_out
} from './../../mutation-types';

export function deleteClient({ dispatch,state,rootGetters }) {
    let client = rootGetters['Organization/client'],
        url = state.url.replace(client+'/','delete'),
        params = { client };
    dispatch('post',{ url,params },{ root:true });
}

export function init({ dispatch,commit,state }) {
    DB.get(table_information_db_table_name,null,function (commit,dispatch,state) {
        if(this.error) return;
        _.forEach(this.result,function (tblObj) {
            if (tblObj.type === 'APP' || !!(state.user)){
                dispatch('addNewSyncTable',tblObj);
                dispatch('requeueSyncImmediate',{ table:tblObj.table,after:init_sync_table_after });
            }
        });
    },commit,dispatch,state)
}
export function initUserTables({ dispatch,commit,state }) {
    DB.get(table_information_db_table_name,{ type:'APP',operator:'!=' },function (commit,dispatch,state) {
        _.forEach(this.result,function (tblObj) {
            dispatch('addNewSyncTable',tblObj);
            dispatch('requeueSyncImmediate',{ table:tblObj.table,after:init_sync_user_table_after });
        });
    },commit,dispatch,state)
}

export function downloadTableRecords({ commit,dispatch },table){
    return DB.get(table_information_db_table_name,{ table },function(commit,dispatch){
        _.forEach(this.result,(tblObj) => {
            dispatch('addNewSyncTable',tblObj);
            dispatch('requeueSyncImmediate',{ table:tblObj.table,after:setup_sync_table_after });
        })
    },commit,dispatch)
}

export function addNewSyncTable({ dispatch,commit },tblObj){
    commit(add_new_table_for_sync,tblObj);
    dispatch('redrawModules',tblObj.table,{ root:true });
}

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
    if (!(state.user)) return dispatch('syncDataReceived_APPUSER',[]);
    let params = { format: 'json',  type: 'data', _user:state.user, client:state.client, created:app_user_create_date_for_fetch },
        url = getters.getTableSyncUrl(table);
    dispatch('post',{ url,params,success:'Sync/syncDataReceived_APPUSER',fail:'Sync/syncDataFail' },{ root:true });
}

export function prepareSyncTable_USER({ dispatch,getters,state,commit },table){
    if (!(state.user)) return dispatch('syncDataReceived',[]);
    let params = { format: 'json',  type: 'data', _user:state.user, client:state.client },
        url = getters.getTableSyncUrl(table), times = state.time,
        sync = _.toSafeInteger(_.get(times,`${table}.sync`,0)), create = _.toSafeInteger(_.get(times,`${table}.create`,0)), update = _.toSafeInteger(_.get(times,`${table}.update`,0));
    if (sync < create || sync <= update){
        Promise.all([getTableRecordsForUpdate(table,sync),getTableRecordsForCreate(table,sync)]).then(activity => {
            activity = _.filter(activity); if (true || _.isEmpty(activity)) return dispatch('post',{ url,params,success:'Sync/syncDataReceived',fail:'Sync/syncDataFail' },{ root:true });
            let data = FD.init().file(activity,table).params(params).get();
            dispatch('file',{ url,params:data,success:'Sync/syncDataReceived',fail:'Sync/syncDataFail' },{ root:true })
        });
    } else {
        dispatch('post',{ url,params,success:'Sync/syncDataReceived',fail:'Sync/syncDataFail' },{ root:true });
    }
}

export function syncDataReceived({ commit,dispatch,state },data){
    let table = state.processing.table; commit(update_table_timing,{ table,type:'sync',time:now() });
    log('Syncing data received for, ' + table);
    if(!_.isEmpty(data)) dispatch('processSyncReceivedData',data);
    log('Finishing process queue, ' + table); commit(finish_processing_queue);
    commit(set_new_sync_time_out,setTimeout(function(dispatch){ dispatch('doSyncProcess') },sync_recheck_timeout_seconds * 1000,dispatch));
    dispatch('requeueSync',table);
}

export function syncDataReceived_APPUSER({ commit,dispatch,state },data){
    let table = state.processing.table; commit(update_table_timing,{ table,type:'sync',time:now() });
    log('Syncing data received for, ' + table); dispatch('deleteRecords',table);
    if(!_.isEmpty(data)) dispatch('processSyncReceivedData',data);
    log('Finishing process queue, ' + table); commit(finish_processing_queue);
    commit(set_new_sync_time_out,setTimeout(function(dispatch){ dispatch('doSyncProcess') },sync_recheck_timeout_seconds * 1000,dispatch));
    dispatch('requeueSync',table);
}

export function syncDataFail({ commit,dispatch,state }){
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
        dispatch(payload); dispatch('redrawModules',table,{ root:true });
    })
}

export function requeueSync({ state,dispatch },table) {
    let { type,up,down } = _.pick(state.tables[table],['type','up','down']);
    let after = ((type === 'APP' || type === 'APPUSER') ? _.toSafeInteger(down) : _.toSafeInteger(up));
    dispatch('requeueSyncImmediate',{ table,type,after });
}

export function requeueSyncImmediate({ state,commit,dispatch },{ table,after,type }) {
    let at = now() + _.toSafeInteger(after); type = type || _.get(state.tables,[table,'type']);
    commit(add_to_app_sync_queue,{ table,type,at }); dispatch('doSyncProcess');
}

export function updateRecords({ commit }, {table, records}) {
    let lastRecIndex = records.length - 1; if(lastRecIndex < 0) return;
    _.forEach(records,(record,idx) => {
        DB.update(table,record.id,record);
        if(idx === lastRecIndex) commit(update_table_timing,{ table,type:'sync',time:now() })
    });
}

export function createRecords({ commit }, {table, records}) {
    if(records.length < 1) return;
    DB.insert(table,records,function(commit,table){
        commit(update_table_timing,{ table,type:'sync',time:now() })
    },commit,table);
}

export function deleteRecords({ commit }, table) {
    DB.delete(table);
}

function now(){ return _.toSafeInteger(new Date().getTime()/1000); }

function getTableRecordsForUpdate(table,sync){
    return new Promise(function(resolve, reject){
        DB.get(table,[{ updated_at:sync,operator:'>=' },{ created_at:sync,operator:'<=' }],function (resolve){
            if (!this.result.length) return resolve(null);
            resolve({ table:this.table(),primary_key:['id'],mode:'update',data:this.result });
        },resolve)
    })
}

function getTableRecordsForCreate(table,sync){
    return new Promise(function(resolve, reject){
        DB.get(table,[{ created_at:sync,operator:'>' }],function (resolve){
            if (!this.result.length) return resolve(null);
            resolve({ table:this.table(),primary_key:['id'],mode:'create',data:this.result });
        },resolve)
    })
}
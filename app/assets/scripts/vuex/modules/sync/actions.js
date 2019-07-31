import {
    table_information_db_table_name, sync_recheck_timeout_seconds, app_user_create_date_for_fetch, setup_sync_table_after, init_sync_table_after,
    init_sync_user_table_after, sync_create_chunk_length, sync_success_response_global_action, sync_failure_response_global_action, gap_between_sync_queue_seconds
} from '../../../constants';
import {
    add_new_table_for_sync, add_to_app_sync_queue,
    processing_queue, finish_processing_queue,
    update_table_timing, set_new_sync_time_out
} from './../../mutation-types';
import {SSSetup} from "../../../services/setup";

export function deleteClient({ dispatch,getters,rootGetters }) {
    let client = rootGetters.client,
        url = getters.deleteClientUrl,
        params = { client };
    dispatch('post',{ url,params },{ root:true });
}

export function init({ dispatch,commit,state,rootGetters }) {
    DB.get(table_information_db_table_name,null,function (commit,dispatch) {
        if(this.error) return log('Error getting app table information to sync');
        _.forEach(this.result,function (tblObj) {
            if (tblObj.type === 'APP' || !!(rootGetters.user)){
                let after = _.toSafeInteger(tblObj.next) - now(); after = ((after < 1) ? 0 : after) + init_sync_table_after;
                dispatch('addNewSyncTable',tblObj);
                dispatch('requeueSyncImmediate',{ table:tblObj.table,after });
            }
        });
    },commit,dispatch,state)
}
export function initUserTables({ dispatch,commit }) {
    return new Promise((resolve) => {
        DB.get(table_information_db_table_name,{ type:'APP',operator:'!=' },function (commit,dispatch,resolve) {
            if(this.error) return log('Error getting user table information to sync');
            _.forEach(this.result,function (tblObj) {
                dispatch('addNewSyncTable',tblObj);
                dispatch('requeueSyncImmediate',{ table:tblObj.table,after:init_sync_user_table_after });
            });
            resolve(this.result);
        },commit,dispatch,resolve)
    });
}

export function downloadTableRecords({ commit,dispatch },tblObj){
    dispatch('addNewSyncTable',tblObj);
    dispatch('requeueSyncImmediate',{ table:tblObj.table,after:setup_sync_table_after });
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
        url = getters.tableSyncUrl(table);
    log('Sync request delivered for, '+table);
    dispatch('post',{ url,params,success:sync_success_response_global_action,fail:sync_failure_response_global_action },{ root:true });
}

export function prepareSyncTable_APPUSER({ dispatch,getters,rootGetters },table){
    if (!(rootGetters.user)) return dispatch('syncDataReceived_APPUSER',[]);
    let params = { format: 'json',  type: 'data', _user:rootGetters.user, client:rootGetters.client, created:app_user_create_date_for_fetch },
        url = getters.tableSyncUrl(table);
    dispatch('post',{ url,params,success:sync_success_response_global_action + '_APPUSER',fail:sync_failure_response_global_action },{ root:true });
}

export function prepareSyncTable_USER({ dispatch,getters,rootGetters,commit,state },table){
    if (!(rootGetters.user)) return dispatch('syncDataReceived_USER',[]);
    let times = state.time[table];
    if(times && haveNewerActivity(times)) return dispatch('uploadNewerActivities',table);
    let params = { format: 'json',  type: 'data', _user:rootGetters.user, client:rootGetters.client }, url = getters.tableSyncUrl(table);
    dispatch('post',{ url,params,success:sync_success_response_global_action + '_USER',fail:sync_failure_response_global_action },{ root:true });
}

export function uploadNewerActivities({ state,getters,rootGetters,dispatch,commit }, table) {
    let times = state.time[table]; if (!times || !haveNewerActivity(times)) return;
    let sync = _.toSafeInteger(times.sync), url = getters.tableSyncUrl(table), params = { format: 'json',  type: 'data', _user:rootGetters.user, client:rootGetters.client };
    Promise.all([getTableRecordsForUpdate(table,sync),getTableRecordsForCreate(table,sync)]).then(activity => {
        activity = _.filter(activity); if (_.isEmpty(activity)) return dispatch('post',{ url,params,success:sync_success_response_global_action + '_USER',fail:sync_success_response_global_action },{ root:true });
        FD.init(params,function(dispatch,commit,table,url){
            log('Upload request delivered for, '+table);
            dispatch('file',{ url,params:this.vParams,success:sync_success_response_global_action + '_USER',fail:sync_failure_response_global_action },{ root:true });
        },dispatch,commit,table,url).file(activity,table);
    });
}

export function syncDataReceived({ commit,dispatch,state },data){
    let table = state.processing.table; log('Syncing data received for, ' + table);
    if(!_.isEmpty(data)) dispatch('processSyncReceivedData',data);
    else commit(update_table_timing,{ table,type:'sync',time:now() });
    log('Finishing process queue, ' + table); commit(finish_processing_queue);
    commit(set_new_sync_time_out,setTimeout(function(dispatch){ dispatch('doSyncProcess') },sync_recheck_timeout_seconds * 1000,dispatch));
    dispatch('requeueSync',table);
}

export function syncDataReceived_APPUSER({ commit,dispatch,state },data){
    let table = state.processing.table; log('Syncing data received for, ' + table);
    dispatch('deleteRecords',table);
    if(!_.isEmpty(data)) dispatch('processSyncReceivedData',data);
    else commit(update_table_timing,{ table,type:'sync',time:now() });
    log('Finishing process queue, ' + table); commit(finish_processing_queue);
    commit(set_new_sync_time_out,setTimeout(function(dispatch){ dispatch('doSyncProcess') },sync_recheck_timeout_seconds * 1000,dispatch));
    dispatch('requeueSync',table);
}

export function syncDataReceived_USER({ commit,dispatch,state },data){
    let table = state.processing.table; log('Syncing data received for, ' + table);
    if(!_.isEmpty(data)){
        if(state.time[table] && haveNewerActivity(state.time[table])) dispatch('uploadNewerActivities',table);
        dispatch('processSyncReceivedData',data);
    }
    else commit(update_table_timing,{ table,type:'sync',time:now() });
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

export function processSyncReceivedData({ dispatch },data) {
    _.forEach(data,(activity) => {
        let table = activity.table, mode = activity.mode, type = mode + ((table === 'setup') ? 'Setup' : 'Records'), payload = { type, table, records:activity.data };
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

export function doAddToAppSyncQueue({state, commit, dispatch}, {table, at, type}) {
    at = _.toSafeInteger(at); type = type || _.get(state.tables,[table,'type']);
    commit(add_to_app_sync_queue,{ table,type,at }); dispatch('doSyncProcess');
}

export function priorSyncQueue({state, commit, dispatch}, qTables) {
    let tables = Array.isArray(qTables) ? qTables : [qTables], at = parseInt(state.queue_index[0] || now()) - (tables.length * gap_between_sync_queue_seconds);
    _.forEach(tables,(table) => commit(add_to_app_sync_queue,{ table,type:_.get(state.tables,[table,'type']),at }));
    dispatch('doSyncProcess');
}

export function updateRecords({ commit }, {table, records}) {
    let lastRecIndex = records.length - 1; if(lastRecIndex < 0) return;
    _.forEach(records,(record,idx) => {
        DB.update(table,record.id,record);
        if(idx === lastRecIndex) commit(update_table_timing,{ table,type:'sync',time:now() })
    });
}

export function createRecords({ commit,dispatch }, {table, records, chunk}) {
    if(chunk === undefined || chunk === null || isNaN(chunk)) return dispatch('createRecords',{table,records,chunk:0});
    let recStart = chunk * sync_create_chunk_length, recEnd = recStart + sync_create_chunk_length, insRecords = records.slice(recStart,recEnd);
    if(insRecords.length > 0) dispatch('_insert',{ table,data:insRecords },{ root:true }).then(() => {
        commit(update_table_timing,{ table,type:'sync',time:now() });
        dispatch('createRecords',{table,records,chunk:chunk+1});
    });
}

export function updateSetup({ commit }, {table, records}) {
    if(records.length < 1) return;
    let data = []; _.forEach(_.head(records),(value,name) => { __.setValue(name,value); data.push(_.zipObject(['name','value'],[name,value])) } );
    let lastRecIndex = data.length - 1; if(lastRecIndex < 0) return;
    _.forEach(data,(record,idx) => {
        DB.update(table,{ name:record.name },{ value:record.value });
        if(idx === lastRecIndex) commit(update_table_timing,{ table,type:'sync',time:now() })
    });
}

export function createSetup({ commit }, {table, records}) {
    if(records.length < 1) return; if(!__) __ = new SSSetup([]);
    let data = []; _.forEach(_.head(records),(value,name) => { __.setValue(name,value); data.push(_.zipObject(['name','value'],[name,value])) } );
    DB.insert(table,data,function(commit,table){
        commit(update_table_timing,{ table,type:'sync',time:now() })
    },commit,table);
}

export function deleteRecords({ commit }, table) {
    DB.delete(table);
}

function now(){ return __.now(); }

function getTableRecordsForUpdate(table,sync){
    return new Promise(function(resolve){
        DB.get(table,[{ updated_at:sync,operator:'>=' },{ created_at:sync,operator:'<' }],function (resolve){
            if (!this.result.length) return resolve(null);
            resolve({ table:this.table(),primary_key:['id'],mode:'update',data:this.result });
        },resolve)
    })
}

function getTableRecordsForCreate(table,sync){
    return new Promise(function(resolve){
        DB.get(table,[{ created_at:sync,operator:'>' }],function (resolve){
            if (!this.result.length) return resolve(null);
            resolve({ table:this.table(),primary_key:['id'],mode:'create',data:this.result });
        },resolve)
    })
}

function haveNewerActivity({sync, create, update}) {
    sync = _.toSafeInteger(sync); create = _.toSafeInteger(create); update = _.toSafeInteger(update);
    return (create > sync || update >= sync)
}
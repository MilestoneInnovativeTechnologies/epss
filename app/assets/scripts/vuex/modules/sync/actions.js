import {
    table_information_db_table_name,
    app_user_create_date_for_fetch,
    sync_create_chunk_length,
    sync_success_response_global_action,
    sync_failure_response_global_action,
    download_common_params, max_sync_download_retry_count
} from '../../../constants';
import {
    add_new_table_for_sync,
    add_to_sync_download_queue,
    increment_sync_download_failure_count,
    remove_first_sync_download_queue_item,
    update_table_timing,
} from './../../mutation-types';
import {SSSetup} from "../../../services/setup";

export function deleteClient({ dispatch,getters,rootGetters }) {
    let client = rootGetters.client, url = getters.deleteClientUrl, params = { client };
    dispatch('post',{ url,params },{ root:true });
}

export function init({ commit,rootGetters,dispatch,state }) {
    DB.get(table_information_db_table_name,null,function (rootGetters,commit) {
        if(this.error) return log('Error getting app table information to sync');
        _.forEach(this.result,function (tblObj) {
            if (tblObj.type === 'APP' || !!(rootGetters.user)){
                commit(add_new_table_for_sync,_.omit(tblObj,['created_at','updated_at']));
            }
        });
        dispatch('triggerEventSubscribers',{ event:state.subscribeEvents[0],payload:Object.keys(state.tables) },{ root:true })
    },rootGetters,commit)
}

export function SSEMonitor({ state,dispatch },tables) {
    tables = Array.isArray(tables) ? tables : [tables]; if(tables.length === 0) return;
    for(let x in tables) { let table = tables[x], tblObj = state.tables[table]; if(tblObj.direction === 'upload') return;
        if(state.queue_download.indexOf(table) === -1) dispatch('queueTableRecordDownload',{ table, type:tblObj.type });
    }
}

export function syncDataReceived({ dispatch,commit }, data) {
    commit(remove_first_sync_download_queue_item);
    if(!Array.isArray(data) || _.isEmpty(data)) return;
    dispatch('doProcessSyncData',data);
}

export function doProcessSyncData({ dispatch,commit,state },data) {
    _.forEach(data,(activity) => {
        if(activity.table === 'setup') return processSetupActivity(activity);
        let table = activity.table, mode = activity.mode, type = mode === 'update' ? '_update' : '_insert', data = activity.data, time = __.dtz(activity.datetime);
        if(state.tables[table].direction !== 'upload'){
            commit(update_table_timing,{ table,type:'download',time });
            if(state.tables[table].type === 'APPUSER') deleteTableRecords(table);
            for(let i = 0; i < data.length; i += sync_create_chunk_length)
                dispatch(type,{ table,data:data.slice(i,sync_create_chunk_length + i),upload:false },{ root:true })
                    .then(activity => commit(update_table_timing,{ table,type:mode,time:_.get(_.last(activity.data),mode+'d_at') }))
        }
    })
}

export function syncDataFail({ state,commit }){
    let fTable = state.queue_download[0]; commit(increment_sync_download_failure_count,fTable);
    commit(remove_first_sync_download_queue_item);
    if(state.failure_count[fTable] <= max_sync_download_retry_count) commit(add_to_sync_download_queue,[fTable])
}

export function queueTableRecordDownload({ rootGetters,getters,commit,dispatch},{ table,type }) {
    let params = getDownloadParams(type,rootGetters), url = getters.tableSyncUrl(table);
    commit(add_to_sync_download_queue,[table]);
    dispatch('post',{ url,params,success:sync_success_response_global_action,fail:sync_failure_response_global_action },{ root:true });
}

export function initUserTables({ dispatch,commit,state }) {
    return new Promise((resolve) => {
        DB.get(table_information_db_table_name,{ type:'APP',operator:'!=' },function (state,commit,dispatch,resolve) {
            if(this.error) return log('Error getting user table information to sync');
            _.forEach(this.result,function (tblObj) { commit(add_new_table_for_sync,_.omit(tblObj,['created_at','updated_at'])); });
            resolve(this.result); dispatch('triggerEventSubscribers',{ event:state.subscribeEvents[0],payload:Object.keys(state.tables) },{ root:true })
        },state,commit,dispatch,resolve)
    });
}
export function forceDownloadUserTables({ dispatch }) {
    DB.get(table_information_db_table_name,{ type:'APPUSER' },function (dispatch) {
        if(this.error) return log('Error getting app user table information to force download');
        _.forEach(this.result,function (tblObj) {
            dispatch('queueTableRecordDownload',{ table:tblObj.table, type:tblObj.type })
        });
    },dispatch)
}

function getDownloadParams(type, rGetters) {
    let params = download_common_params;
    if(type !== 'APP') params = _.assign({},params,{ _user:rGetters.user, client:rGetters.client });
    if(type === 'APPUSER') params = _.assign({},params,{ created:app_user_create_date_for_fetch });
    return params;
}

function processSetupActivity(activity) {
    if(!__) __ = new SSSetup([]);
    if(activity.data.length < 1) return; let records = activity.data;
    if(activity.mode === 'update'){
        _.forEach(_.head(records),(value,name) => { __.setValue(name,value); DB.update('setup',{ name }, { value }) } );
    } else {
        let data = []; _.forEach(_.head(records),(value,name) => { __.setValue(name,value); data.push(_.zipObject(['name','value'],[name,value])) } );
        DB.insert('setup',data);
    }
}

function deleteTableRecords(table) { DB.delete(table); }

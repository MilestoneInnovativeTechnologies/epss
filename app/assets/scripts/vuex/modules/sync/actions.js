import {
    table_information_db_table_name,
    sync_create_chunk_length,
} from '../../../constants';
import {
    add_new_table_for_sync,
    remove_user_tables_from_sync,
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


export function doProcessSyncData({ dispatch,commit,state },data) {
    _.forEach(data,(activity) => {
        if(activity.table === 'setup') return processSetupActivity(activity);
        let table = activity.table, mode = activity.mode, data = activity.data, time = __.dtz(activity.datetime);
        if(state.tables[table].direction !== 'upload'){
            commit(update_table_timing,{ table,type:'download',time });
            if(state.tables[table].type === 'APPUSER') deleteTableRecords(table);
            dispatch( (mode === 'update') ? 'doUpdateSyncData' : 'doInsertSyncData',{ table,data });
        }
    })
}

export function doInsertSyncData({ commit,dispatch }, { table,data }) {
    for(let i = 0; i < data.length; i += sync_create_chunk_length){
        dispatch('_insert',{ table,data:data.slice(i,sync_create_chunk_length + i),upload:false },{ root:true })
            .then(activity => commit(update_table_timing,{ table,type:'create',time:_.get(_.last(activity.data),'created_at') }))
    }
}
const cFields = { 'APP':'id','USER':'_ref','APPUSER':null };
export function doUpdateSyncData({ dispatch,state,commit }, { table,data }) {
    let cField = cFields[state.tables[table].type];
    for(let i = 0; i < data.length; i++){
        let condition = cField ? _.pick(data[i],cField) : null;
        dispatch('_update',{ table,data:data[i],condition,upload:false,create:false },{ root:true })
            .then(activity => commit(update_table_timing,{ table,type:'update',time:_.get(_.last(activity.data),'updated_at') }))
    }
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
export function delUserSyncTables({ dispatch,commit,state }) {
    commit(remove_user_tables_from_sync);
    dispatch('triggerEventSubscribers',{ event:state.subscribeEvents[0],payload:Object.keys(state.tables) },{ root:true });
}
export function forceDownloadUserTables({ dispatch }) {
    DB.get(table_information_db_table_name,{ type:'APPUSER' },function (dispatch) {
        if(this.error) return log('Error getting app user table information to force download');
        if(this.result.length) dispatch('Download/tables',_.map(this.result,'table'),{ root:true });
    },dispatch)
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

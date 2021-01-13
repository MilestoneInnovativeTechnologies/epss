import {
    database_fetch_url,
    organization_fetch_url,
    table_information_db_table_fields,
    table_information_db_table_indexes,
    table_information_db_table_name
} from "../../../constants";
import {add_new_table_for_sync, set_state_data, remove_event_subscriber} from "../../mutation-types";

export function init({ commit,dispatch,state }) {
    return new Promise((resolve) => {
        DB.get(state.dbTables[0],null,function(state,commit,dispatch,resolve){
            if (this.error) return log(`Error in getting data from App table..`);
            ['batchDownloadStarting','batchDownloadedTable'].forEach(event => commit(remove_event_subscriber,{ module:'App',event },{ root:true }));
            let data = _(this.result).keyBy('name').mapValues(item => item.detail).value();
            commit(set_state_data,data); dispatch('redrawModules',state.dbTables[0],{ root:true });
            resolve(this.result);
        },state,commit,dispatch,resolve)
    });
}

export function register({ dispatch,commit,rootState },data){
    if(!rootState['Connection'].status) return commit(set_state_data,{ message:"No Internet Connection" });
    commit('taskCompleted','Init state data');
    commit(set_state_data,data);
    dispatch('deviceRegistration',{ uuid:data.uuid });
}
export function deviceRegistration({ dispatch,commit }, {uuid}) {
    let url = organization_fetch_url, params = { uuid }, success = 'App/setup';
    commit('taskCompleted','Request device registration data');
    dispatch('get',{ url,params,success },{ root: true });
}
export function setup({ state,dispatch,commit },data){
    if(_.isEmpty(data)) { let message = 'OOPS!! Device not registered!!'; commit(set_state_data,{ message }); return log(message); }
    data = _.assign(data,_.pick(state,['uuid','width','height','print_width'])); let callback = _.bind(commit,null,'taskCompleted')
    Promise.all(_.map([...state.dbTables,...state.appTables],(tbl,idx) => createTable(tbl,state.dbFields[idx],state.dbIndexes[idx],state.dbSLog[idx],callback))).then(() => {
        let reqData = _.omit(data,['id','created_at','updated_at']), insData = _.map(reqData,(detail,name) => _.zipObject(['name','detail'],[name,detail]));
        commit('taskCompleted','Initialize app'); commit(set_state_data,reqData);
        DB.insert(state.dbTables[0],insData,function(dispatch,appTable){
            dispatch('redrawModules', appTable, {root: true});
            commit('taskCompleted','Insert device registration data');
            dispatch('setupTables');
        },dispatch,state.dbTables[0]);
    }).catch(() => alert("Error in creating application database\nTry reinstalling application with latest version."));
}

export function setupTables({ dispatch,commit }) {
    createTable(table_information_db_table_name, table_information_db_table_fields,table_information_db_table_indexes);
    commit('taskCompleted','Reset client on server');
    dispatch('Sync/deleteClient',null,{ root:true }).finally(() => {
        dispatch('get',{ url:database_fetch_url,success:'App/createTables' },{ root:true }).finally(() => {
            commit('taskCompleted','Get DB tables');
        });
    });
}
export function createTables({ dispatch,commit },{ menu,db }) {
    let callback = _.bind(function(tbl,insObj){ DB.insert(tbl,insObj) },null,table_information_db_table_name)
    Promise.all(_.map(db,(Ary,table) => createTable(table,Ary[0],Ary[3],getInformationInsertData(table,Ary),callback))).then(() => {
        commit('taskCompleted','Create DB tables');
        dispatch('downloadTables');
        dispatch('Menu/setup',menu,{ root:true });
    });
}

export function downloadTables({ commit,dispatch,state }){
    DB.get(table_information_db_table_name,{ type:'APP' },function (commit,dispatch) {
        if(this.error) return alert('Unexpected error, Try re-installing application.');
        let tables = []; _.forEach(this.result,tblObj => {
            tables.push(tblObj.table);
            commit('Sync/'+add_new_table_for_sync,_.omit(tblObj,['created_at','updated_at']),{ root:true });
        });
        commit('dwnTables',tables); dispatch('Download/tables',tables,{ root:true });
    },commit,dispatch);
}
export function batchDownloadStarting({ dispatch,commit },tables){
    if(tables && tables.length > 0) commit('taskCompleted','Init synchronizing app records');
}
export function batchDownloadedTable({ commit },table){
    if(table) commit('downloadedTable',table);
}

function createTable(name,fields,indexes,done,callback){
    return new Promise((resolve, reject) => {
        DB.create(name,fields,indexes,function(resolve,done,callback){
            return callback ? resolve(callback(done)) : resolve(done || true);
        },resolve,done,callback)
    })
}

function getInformationInsertData(table,details){
    return { table,fields:details[0],type:details[1],direction:details[2],create:0,update:0 }
}
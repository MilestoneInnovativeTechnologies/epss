import {
    database_fetch_url,
    organization_fetch_url,
    table_information_db_table_fields,
    table_information_db_table_indexes,
    table_information_db_table_name
} from "../../../constants";
import {add_new_table_for_sync, set_state_data} from "../../mutation-types";

export function sLog({commit},task) {
    let set = 'tasks.' + task, setObj = _.zipObject([set],[true]);
    commit(set_state_data,setObj);
}

export function init({ commit,dispatch,state }) {
    return new Promise((resolve) => {
        DB.get(state.dbTables[0],null,function(state,commit,dispatch,resolve){
            if (this.error) return log(`Error in getting data from App table..`);
            let data = _(this.result).keyBy('name').mapValues(item => item.detail).value();
            commit(set_state_data,data); dispatch('redrawModules',state.dbTables[0],{ root:true });
            resolve(this.result);
        },state,commit,dispatch,resolve)
    });
}

export function register({ dispatch,commit,rootState },data){
    if(!rootState['Connection'].status) return commit(set_state_data,{ message:"No Internet Connection" });
    dispatch('sLog','Init state data'); commit(set_state_data,data);
    dispatch('deviceRegistration',{ uuid:data.uuid });
}
export function deviceRegistration({ dispatch }, {uuid}) {
    let url = organization_fetch_url, params = { uuid }, success = 'App/setup';
    dispatch('sLog','Request device registration data');
    dispatch('get',{ url,params,success },{ root: true });
}
export function setup({ state,dispatch,commit },data){
    if(_.isEmpty(data)) { let message = 'OOPS!! Device not registered!!'; commit(set_state_data,{ message }); return log(message); }
    data = _.assign(data,_.pick(state,['uuid','width','height','print_width']));
    Promise.all([..._.map([...state.dbTables,...state.appTables],(tbl,idx) => createTable(tbl,state.dbFields[idx],state.dbIndexes[idx],state.dbSLog[idx]))]).then((resArray) => {
        _.forEach(resArray,(slog) => dispatch('sLog',slog));
        let reqData = _.omit(data,['id','created_at','updated_at']), insData = _.map(reqData,(detail,name) => _.zipObject(['name','detail'],[name,detail]));
        dispatch('sLog','Initialize app'); commit(set_state_data,reqData);
        DB.insert(state.dbTables[0],insData,function(dispatch,appTable){
            dispatch('redrawModules', appTable, {root: true}); dispatch('sLog','Insert device registration data'); dispatch('setupTables');
        },dispatch,state.dbTables[0]);
    }).catch(() => alert("Error in creating application database\nTry reinstalling application with latest version."));
}

export function setupTables({ dispatch }) {
    createTable(table_information_db_table_name, table_information_db_table_fields,table_information_db_table_indexes);
    dispatch('sLog','Reset client on server'); dispatch('Sync/deleteClient',null,{ root:true }).finally(() => {
        dispatch('get',{ url:database_fetch_url,success:'App/createTables' },{ root:true }).finally(() => {
            dispatch('sLog','Get DB tables');
        });
    });
}
export function createTables({ dispatch,commit },{ menu,db }) {
    dispatch('sLog','Create DB tables');
    Promise.all([..._.map(db,(Ary,table) => createTable(table,Ary[0],Ary[3],getInformationInsertData(table,Ary)))]).then((insArray) => {
        DB.insert(table_information_db_table_name, insArray, function (dispatch,commit,menu) {
            dispatch('downloadTables');
            dispatch('Menu/setup',menu,{ root:true });
        },dispatch,commit,menu);
    });
}

export function downloadTables({ commit,dispatch }){
    DB.get(table_information_db_table_name,{ type:'APP' },function (commit,dispatch) {
        if(this.error) return alert('Unexpected error, Try re-installing application.');
        let tables = []; _.forEach(this.result,tblObj => {
            tables.push(tblObj.table);
            commit('Sync/'+add_new_table_for_sync,_.omit(tblObj,['created_at','updated_at']),{ root:true });
        });
        commit('dwnTables',tables); dispatch('Download/tables',tables,{ root:true });
    },commit,dispatch);
}
export function batchDownloadStarting({ dispatch },tables){
    if(tables && tables.length > 0) dispatch('sLog','Init synchronizing app records');
}
export function batchDownloadedTable({ commit },table){
    if(table) commit('downloadedTable',table);
}

function createTable(name,fields,indexes,done){
    return new Promise((resolve, reject) => {
        DB.create(name,fields,indexes,function(resolve,done){
            return resolve(done);
        },resolve,done)
    })
}

function getInformationInsertData(table,details){
    return { table,fields:details[0],type:details[1],direction:details[2],create:0,update:0 }
}
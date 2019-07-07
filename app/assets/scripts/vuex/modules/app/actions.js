import {
    database_fetch_url,
    organization_fetch_url,
    table_information_db_table_fields,
    table_information_db_table_name
} from "../../../constants";
import {set_state_data} from "../../mutation-types";

function sLog(commit,task) {
    let set = 'tasks.' + task, setObj = _.zipObject([set],[true]);
    commit(set_state_data,setObj);
}

export function init({ commit,state }) {
    return new Promise((resolve, reject) => {
        DB.get(state.dbTables[0],null,function(commit,resolve){
            if (this.error) return log(`Error in getting data from App table..`, this.result);
            let data = _(this.result).keyBy('name').mapValues(item => item.detail).value();
            commit(set_state_data,data);
            resolve(this.result);
        },commit,resolve)
    });
}

export function setup({ state,dispatch,commit },data){
    sLog(commit, 'Create App DB');
    DB.create(state.dbTables[0], state.fields, function (table, dispatch, data, sLog, commit) {
        let insData = _.map(data, (detail, name) => _.zipObject(['name', 'detail'], [name, detail]));
        dispatch('_insert',{ table,data:insData },{ root:true }).then(() => sLog(commit, 'Insert device basic data'));
    }, state.dbTables[0], dispatch, data, sLog, commit).then(() => {
        sLog(commit, 'Create User Table');
        DB.create(state.dbTables[1], state.fields).then(() => dispatch('deviceRegistration', data));
    });
}
export function deviceRegistration({ dispatch,commit }, {uuid}) {
    let url = organization_fetch_url, params = { uuid }, success = 'App/setupDevice';
    sLog(commit,'Request device registration data');
    dispatch('get',{ url,params,success },{ root: true });
}
export function setupDevice({ commit,dispatch },data){
    if(_.isEmpty(data)) { let message = 'OOPS!! Device not registered!!'; commit(set_state_data,{ message }); return log(message); }
    dispatch('insertDeviceData',data).then(() => dispatch('setupTables'));
}
export function insertDeviceData({commit,dispatch,state}, data) {
    return new Promise((resolve, reject) => {
        sLog(commit,'Insert Device registration data');
        let reqData = _.omit(data,['id','created_at','updated_at']), insData = _.map(reqData,(detail,name) => _.zipObject(['name','detail'],[name,detail]));
        sLog(commit,'Initialize App');
        dispatch('_insert',{ table:state.dbTables[0], data:insData },{ root:true }).then(() =>{ dispatch('init').then(() => resolve(true)); });
    });
}
export function setupTables({ commit,dispatch }) {
    sLog(commit,'Reset client on server'); dispatch('Sync/deleteClient',null,{ root:true });
    sLog(commit,'Get DB Tables'); dispatch('get',{ url:database_fetch_url,success:'App/createTables' },{ root:true });
}
export function createTables({ commit,dispatch },data) {
    sLog(commit,'Create and Sync Tables');
    log('Creating: ' + table_information_db_table_name);
    DB.create(table_information_db_table_name, table_information_db_table_fields, function (data, dispatch) {
        if (this.error) return log(`Error in creating ${table_information_db_table_name} db table`, this.result);
        _.forEach(data, (Ary, Table) => {
            if (!Table) return; log('Creating: ' + Table);
            DB.create(Table, Ary[0], function (table, fields, type, down, up, dispatch) {
                let insertData = {table, fields, type, down, up};
                DB.insert(table_information_db_table_name, insertData, function (tblObj, dispatch) {
                    if (tblObj.type === 'APP') dispatch('Sync/downloadTableRecords', tblObj, {root: true});
                }, insertData, dispatch);
            }, Table, Ary[0], Ary[1], _.toSafeInteger(parseInt(Ary[2]) * 3600), _.toSafeInteger(parseInt(Ary[3]) * 60), dispatch);
        });
    }, data, dispatch);
}
import { database_fetch_url, organization_fetch_url, table_information_db_table_fields, table_information_db_table_name } from "../../../constants";
import {set_state_data} from "../../mutation-types";

export function sLog({commit},task) {
    let set = 'tasks.' + task, setObj = _.zipObject([set],[true]);
    commit(set_state_data,setObj);
}

export function init({ commit,state }) {
    return new Promise((resolve) => {
        DB.get(state.dbTables[0],null,function(commit,resolve){
            if (this.error) return log(`Error in getting data from App table..`);
            let data = _(this.result).keyBy('name').mapValues(item => item.detail).value();
            commit(set_state_data,data);
            resolve(this.result);
        },commit,resolve)
    });
}

export function register({ dispatch,commit },data){
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
    dispatch('sLog','Create app table'); data = _.assign(data,_.pick(state,['uuid','width','height']));
    DB.create(state.dbTables[0], state.fields, function (state, dispatch, data, commit) {
        dispatch('sLog','Insert device registration data');
        let reqData = _.omit(data,['id','created_at','updated_at']), insData = _.map(reqData,(detail,name) => _.zipObject(['name','detail'],[name,detail]));
        dispatch('sLog','Initialize app'); commit(set_state_data,reqData);
        dispatch('_insert',{ table:state.dbTables[0], data:insData },{ root:true }).then(() => {
            dispatch('sLog','Create user table');
            DB.create(state.dbTables[1], state.fields).then(() => dispatch('setupTables'));
        });
    }, state, dispatch, data, commit)
}

export function setupTables({ dispatch }) {
    dispatch('sLog','Reset client on server'); dispatch('Sync/deleteClient',null,{ root:true });
    dispatch('sLog','Get DB tables'); dispatch('get',{ url:database_fetch_url,success:'App/createTables' },{ root:true });
}
export function createTables({ commit,dispatch },data) {
    dispatch('sLog','Create tables');
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
import { database_fetch_url, organization_fetch_url, table_information_db_table_fields, table_information_db_table_name } from "../../../constants";
import {set_state_data} from "../../mutation-types";

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
    data = _.assign(data,_.pick(state,['uuid','width','height']));
    Promise.all([..._.map([...state.dbTables,...state.appTables],(tbl,idx) => createTable(tbl,state.dbFields[idx],state.dbSLog[idx]))]).then((resArray) => {
        _.forEach(resArray,(slog) => dispatch('sLog',slog));
        let reqData = _.omit(data,['id','created_at','updated_at']), insData = _.map(reqData,(detail,name) => _.zipObject(['name','detail'],[name,detail]));
        dispatch('sLog','Initialize app'); commit(set_state_data,reqData);
        DB.insert(state.dbTables[0],insData,function(dispatch,appTable){
            dispatch('redrawModules', appTable, {root: true}); dispatch('sLog','Insert device registration data'); dispatch('setupTables');
        },dispatch,state.dbTables[0]);
    }).catch(() => alert("Error in creating application database\nTry reinstalling application with latest version."));
}

export function setupTables({ dispatch }) {
    dispatch('sLog','Reset client on server'); dispatch('Sync/deleteClient',null,{ root:true }).finally(() => {
        dispatch('get',{ url:database_fetch_url,success:'App/createTables' },{ root:true }).finally(() => {
            dispatch('sLog','Get DB tables');
        });
    });
}
export function createTables({ dispatch },data) {
    dispatch('sLog','Create DB tables'); createTable(table_information_db_table_name, table_information_db_table_fields,data).then(data => {
        Promise.all([..._.map(data,(Ary,table) => createTable(table,Ary[0],getInformationInsertData(table,Ary)))]).then((insArray) => {
            DB.insert(table_information_db_table_name, insArray, function (dispatch) {
                dispatch('Sync/init',null,{ root:true });
                setTimeout(function(dispatch){ dispatch('SSE/restartEventSource',null,{ root:true }) },1000,dispatch);
            },dispatch);
        })
    });
}

export function syncTableChanged({ dispatch },tables){
    if(!tables || tables.length === 0) return;
    dispatch('sLog','Init synchronizing app records');
}

function createTable(name,fields,done){
    return new Promise((resolve, reject) => {
        DB.create(name,fields,function(resolve,done){
            return resolve(done);
        },resolve,done)
    })
}

function getInformationInsertData(table,details){
    return { table,fields:details[0],type:details[1],direction:details[2],create:0,update:0 }
}
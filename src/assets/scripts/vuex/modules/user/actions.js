import {set_state_data,set_db_data} from "../../mutation-types";

const userStateKeys = ['name','email','id','api_token','reference'];
const makeModuleListNull = ['Stores','Areas','Customer','SalesOrder'];
const makeModuleDBDataNull = { user_store_area:'User', sales_order:'SalesOrder',user_settings:'Settings' };
const makeRootStateDataNull = ['default_store','default_fycode'];

export function doLogin({ state,commit,dispatch }){
    let { login,password } = state; commit(set_state_data,{ validating:true });
    dispatch('api',{ item:'login', params: { login,password }, success: 'User/loginResponse' },{ root:true })
}

export function loginResponse({ commit,dispatch,state }, data) {
    if(_.isEmpty(data)) return commit(set_state_data,{ validating:false,message:'No email and password matching records found' });
    makeModuleListNull.forEach((mod) => commit(mod+'/'+set_state_data,{ list:[] },{ root:true }));
    dispatch('doInsertLoginData',getNameDetailArray(data)).then((activity) => {
        dispatch('doPostLoginActions',getNameDetailObject(activity.data))
    });
}
export function doInsertLoginData({ dispatch },data){
    return new Promise((resolve) => {
        dispatch('_insert',{ table:'epss_user',data:data,upload:false },{ root:true }).then(resolve);
    })
}
export function doPostLoginActions({ commit,dispatch,state:{ pLogin } },data) {
    commit(set_state_data,{ ...(_.pick(data,userStateKeys)),validating:false });
    dispatch('Sync/initUserTables',pLogin !== data.login || true,{ root:true });
    return Promise.resolve(true);
}
export function logout({ commit,dispatch,state },vm) {
    commit(set_state_data,{ pLogin:state.login });
    return new Promise((resolve, reject) => {
        DB.delete('epss_user',null,function(resolve,vm,commit,dispatch){
            commit(set_state_data,_(userStateKeys).mapKeys(key => key).mapValues(() => null).value());
            _.forEach(makeModuleDBDataNull,(mod,db) => commit(mod+'/'+set_db_data,{ db,data:[] },{ root:true }));
            dispatch('Sync/delUserSyncTables',null,{ root:true });
            DB.get('epss_tblinfo',{ type:'APPUSER' },function (dispatch){ if(this.result) this.result.forEach(({table}) => dispatch('_delete',{ table },{ root:true })) },dispatch)
            commit(set_state_data,_.zipObject(makeRootStateDataNull,Array(makeRootStateDataNull.length).fill(null)),{ root:true })
            resolve(vm);
        },resolve,vm,commit,dispatch)
    });
}

export function batchDownloadStarting({ commit },tables){
    if(tables && tables.length > 0) commit('downloadable',tables);
}
export function batchDownloadedTable({ commit },table){
    if(table) commit('downloaded',table);
}


function getNameDetailArray(obj){
    return _.map(obj,(detail,name) => _.zipObject(['name','detail'],[name,detail]))
}

function getNameDetailObject(ary){
    return _(ary).mapKeys('name').mapValues('detail').value();
}

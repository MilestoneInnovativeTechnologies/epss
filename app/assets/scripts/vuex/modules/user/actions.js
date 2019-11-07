import {add_event_subscriber, remove_user_tables_from_sync, set_state_data} from "../../mutation-types";

const userStateKeys = ['name','email','id','api_token','reference'];
const makeModuleListNull = ['Stores','Areas','Customer','SalesOrder'];

export function doLogin({ state,commit,dispatch }){
    let { login,password } = state; commit(set_state_data,{ validating:true });
    dispatch('api',{ item:'login', params: { login,password }, success: 'User/loginResponse' },{ root:true })
}

export function loginResponse({ commit,dispatch,state }, data) {
    if(_.isEmpty(data)) return commit(set_state_data,{ validating:false,message:'No email and password matching records found' });
    dispatch('doInsertLoginData',getNameDetailArray(data));
    makeModuleListNull.forEach((mod) => commit(mod+'/'+set_state_data,{ list:[] },{ root:true }));
    if(data.login != state.pLogin) dispatch('Sync/forceDownloadUserTables',null,{ root:true });
}
export function doInsertLoginData({ dispatch },data){
    return new Promise((resolve) => {
        dispatch('_insert',{ table:'epss_user',data:data,upload:false },{ root:true }).then((activity) => {
            dispatch('doPostLoginActions',getNameDetailObject(activity.data));
        });
    })
}
export function doPostLoginActions({ commit,dispatch },data) {
    commit(set_state_data,_.pick(data,userStateKeys));
    dispatch('Sync/initUserTables',null,{ root:true });
    commit(set_state_data,{ validating:false });
}
export function logout({ commit,dispatch,state },vm) {
    commit(set_state_data,{ pLogin:state.login });
    return new Promise((resolve, reject) => {
        DB.delete('epss_user',null,function(resolve,vm,commit,dispatch){
            commit(set_state_data,_(userStateKeys).mapKeys(key => key).mapValues(() => null).value());
            dispatch('Sync/delUserSyncTables',null,{ root:true });
            resolve(vm);
        },resolve,vm,commit,dispatch)
    });
}

function getNameDetailArray(obj){
    return _.map(obj,(detail,name) => _.zipObject(['name','detail'],[name,detail]))
}

function getNameDetailObject(ary){
    return _(ary).mapKeys('name').mapValues('detail').value();
}

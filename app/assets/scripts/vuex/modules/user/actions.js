import { set_state_data } from "../../mutation-types";

const userStateKeys = ['name','email','id','api_token','reference'];

export function doLogin({ state,commit,dispatch }){
    let { email,password } = state; commit(set_state_data,{ validating:true });
    dispatch('api',{ item:'login', params: { email,password }, success: 'User/loginResponse' },{ root:true })
}

export function loginResponse({ commit,dispatch }, data) {
    if(_.isEmpty(data)) return commit(set_state_data,{ validating:false,message:'No email and password matching records found' });
    dispatch('doInsertLoginData',getNameDetailArray(data))
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
export function logout({ commit },vm) {
    return new Promise((resolve, reject) => {
        DB.delete('epss_user',null,function(resolve,vm,commit){
            commit(set_state_data,_(userStateKeys).mapKeys(key => key).mapValues(() => null).value());
            resolve(vm);
        },resolve,vm,commit)
    });
}

function getNameDetailArray(obj){
    return _.map(obj,(detail,name) => _.zipObject(['name','detail'],[name,detail]))
}

function getNameDetailObject(ary){
    return _(ary).mapKeys('name').mapValues('detail').value();
}

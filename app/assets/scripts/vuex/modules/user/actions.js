import { set_state_data } from "../../mutation-types";

const userStateKeys = ['name','email','id','api_token','reference'];

export function doLogin({ state,commit,dispatch }){
    let { email,password } = state; commit(set_state_data,{ validating:true });
    dispatch('api',{ item:'login', params: { email,password }, success: 'User/doLoginActions' },{ root:true })
}

export function doLoginActions({ commit,dispatch },data) {
    return new Promise((resolve, reject) => {
        if(_.isEmpty(data)) return reject(commit(set_state_data,{ validating:false,message:'No email and password matching records found' }));
        let insData = _.map(data,(detail,name) => _.zipObject(['name','detail'],[name,detail]));
        dispatch('_insert',{ table:'user',data:insData },{ root:true }).then(() => {
            commit(set_state_data,_.pick(data,userStateKeys));
            dispatch('Sync/initUserTables',null,{ root:true }).then((data) => resolve(data));
            commit(set_state_data,{ validating:false });
        });
    })
}
export function logout({ commit },vm) {
    return new Promise((resolve, reject) => {
        DB.delete('user',null,function(resolve,vm,commit){
            commit(set_state_data,_(userStateKeys).mapKeys(key => key).mapValues(() => null).value());
            resolve(vm);
        },resolve,vm,commit)
    });
}

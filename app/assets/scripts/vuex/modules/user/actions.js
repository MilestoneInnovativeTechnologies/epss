import {
    init_login_validation,
    login_validation_failed,
    update_axios_user_details,
    update_login_details, update_sync_user_details
} from "../../mutation-types";

//Manul login entry to debug
export function init({ dispatch }){
    dispatch('LoginReceived',{"id":300109,"name":"Sales Executive","email":"SE01.sls@temp.mail","api_token":"e5e4acb744def44efab04e8270e2bc4c09d528120fdf923e8afe3d5befdf4c4b","reference":"SE01","email_verified_at":null,"created_at":"2019-06-14 10:28:46","updated_at":"2019-06-14 11:17:03"})
}

export function login({ state,commit,dispatch }){
    let { email,password } = state; commit(init_login_validation);
    dispatch('api',{ item:'login', params: { email,password }, success: 'User/LoginReceived'},{ root:true })
}

export function LoginReceived({ commit,dispatch },data) {
    if(_.isEmpty(data)) return commit(login_validation_failed);
    commit(update_login_details,data);
    commit('Axios/' + update_axios_user_details,data,{ root:true });
    commit('Sync/' + update_sync_user_details,data,{ root:true });
    dispatch('Sync/initUserTables',null,{ root:true });
}

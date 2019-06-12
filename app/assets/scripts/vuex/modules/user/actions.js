import {
    init_login_validation,
    login_validation_failed,
    update_axios_user_details,
    update_login_details, update_sync_user_details
} from "../../mutation-types";

export function login({ state,commit,dispatch }){
    let { email,password } = state; commit(init_login_validation);
    dispatch('api',{ item:'login', params: { email,password }, success: 'User/LoginReceived'},{ root:true })
}

export function LoginReceived({ commit,state },data) {
    if(_.isEmpty(data)) return commit(login_validation_failed);
    commit(update_login_details,data);
    commit('Axios/' + update_axios_user_details,data,{ root:true });
    commit('Sync/' + update_sync_user_details,data,{ root:true });
}

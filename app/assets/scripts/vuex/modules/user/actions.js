import {update_axios_user_details, update_login_details} from "../../mutation-types";

export function login({ state,dispatch }){
    let { email,password } = state;
    dispatch('api',{ item:'login', params: { email,password }, success: 'User/APIReceived'},{ root:true })
}

export function APIReceived({ commit },data) {
    log('Login received',data);
    commit(update_login_details,data);
    commit('Axios/' + update_axios_user_details,data,{ root:true })
}

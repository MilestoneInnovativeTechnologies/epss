export function login({ state,dispatch }){
    let { email,password } = state;
    dispatch('api',{ item:'login', params: { email,password }, success: 'User/APIReceived'},{ root:true })
}

export function APIReceived(data) {
    //console.log(data);
}

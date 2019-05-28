export function get({ dispatch },payload){
    let action = ['Axios','get'].join('/');
    dispatch(action,payload)
}
export function post({ dispatch },payload){
    let action = ['Axios','post'].join('/');
    dispatch(action,payload)
}
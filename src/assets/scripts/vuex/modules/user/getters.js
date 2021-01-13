export function credentials({ login,password,pLogin }) {
    return { login:login || pLogin,password };
}
export function user_store_areas({ id },{ _tableDataFilter }) {
    return _tableDataFilter('user_store_area','user',id);
}
export function stores(state,getters,rootState) {
    return _.map(rootState['Stores'].list,'id');
}
export function areas(state,getters,rootState) {
    return _.map(rootState['Areas'].list,'id');
}
export function customers(state,getters,rootState) {
    return _.map(rootState['Customer'].list,'id');
}


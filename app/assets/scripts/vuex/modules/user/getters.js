export function credentials({ email,password }) {
    return { email,password };
}
export function user_store_areas({ id },{ _tableDataFilter }) {
    return _tableDataFilter('user_store_area','user',id);
}
export function stores(state,{ user_store_areas }) {
    return _.uniq(_.map(user_store_areas,'store'));
}
export function areas(state,{ user_store_areas }) {
    return _.uniq(_.map(user_store_areas,'area'));
}
export function customers(state,{ areas },rootState,rootGetters) {
    return _.flatMap(_.pick(rootGetters['Areas/_tableDataByGroup']('area_users','area'),areas),(groupedArray)=>_.map(groupedArray,'user'));
}


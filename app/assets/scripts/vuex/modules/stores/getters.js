export function stores(state,{ _tableDataById },rootState,rootGetters) {
    return _.pick(_tableDataById('stores'),rootGetters['User/stores'])
}
export function products(state,{ _tableDataById },rootState,rootGetters) {
    return _.pick(_tableDataById('stores'),rootGetters['User/stores'])
}

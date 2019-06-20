export function products(state,getters,rootState,rootGetters) {
    return rootGetters['Product/_tableDataByIdField']('products')
}

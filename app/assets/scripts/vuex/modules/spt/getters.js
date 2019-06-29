export function products(state,{ _tableDataFilter }) {
    return (store) => _tableDataFilter('store_product_transactions','store',store)
}
export function sale(state,getters,rootState,rootGetters) {
    let direction = 'out', user = rootState['User'].id, date = rootGetters.datetime(), _ref = rootGetters._ref();
    let nature = rootGetters['TRNS/NameId'].Fresh,type = rootGetters['TRPS/NameId'].Sale;
    return (store,product,quantity) => { return { direction,nature,type,user,date,store,product,_ref,quantity } }
}

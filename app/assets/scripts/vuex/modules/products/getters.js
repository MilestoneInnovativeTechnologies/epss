export function productTrans(state,getters,rootState,rootGetters) {
    return (product) => { return rootGetters['SPT/_tableDataFilter']('store_product_transactions','product',product) }
}
export function productPrice(state,{ _tableDataFilter }) {
    return (product) => { return _(_tableDataFilter('pricelist','product',product)).groupBy('product').mapValues(PLArray => _.get(_.head(PLArray),'price')).get(product,0) }
}
export function productTax(state,{ _tableDataById }) {
    let tfStr = 'taxfactor' + ((__.TAX02 === 'Yes') ? '02' : '');
    let factors = [tfStr,'sub'+tfStr];
    return (product) => { return _.sum(_.values(_.only(_.get(_tableDataById('products'),product),factors))) }
}

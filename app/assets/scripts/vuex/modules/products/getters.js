export function productTrans(state,getters,rootState,rootGetters) {
    return (product) => { return rootGetters['Stores/_tableDataFilter']('store_product_transactions','product',product) }
}
export function productPrice(state,{ _tableDataFilter }) {
    return (product) => { return _(_tableDataFilter('pricelist','product',product)).groupBy('product').mapValues(PLArray => _.get(_.head(PLArray),'price')).get(product,0) }
}
export function productTax(state,{ _tableDataItemRelation }) {
    let activeTax = (__.TAX === 'Yes') ? 'tax1' : null, relationDeep = [['products','group1']], table = 'productgroups';
    return (product) => { return _.get(_tableDataItemRelation(product,relationDeep,table),activeTax) }
}

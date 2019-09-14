import {product_image_path} from "../../../constants";

export function productTrans(state,getters,rootState,rootGetters) {
    return (product) => { return rootGetters['SPT/_tableDataFilter']('store_product_transactions','product',product) }
}
export function productPrice(state,{ _tableDataFilter }) {
    return (product) => { return _(_tableDataFilter('pricelist','product',product)).groupBy('product').mapValues(PLArray => _.get(_.head(PLArray),'price')).get(product,0) }
}
export function productTax(state,{ _tableDataById }) {
    let tfStr = 'taxfactor' + ((__.TAX02 === 'Yes') ? '02' : '01');
    let factors = [tfStr,'sub'+tfStr];
    return (product) => { return _.sum(_.values(_.only(_.get(_tableDataById('products'),product),factors))) }
}
export function imagePath(state,getters,rootState){
    return [rootState['App'].url_web,product_image_path,''].join('/').replace(/\/+/g,'/').replace('http:/','http://');
}
export function product({ dbTables },{ _tableDataItem,productPrice }){
    return (id) => {
        let product = _tableDataItem(dbTables[0],id);
        _.set(product,'price',productPrice(id)); return product;
    }
}
export function tax(state, {product}, rootState, rootGetters) {
    return (pid,fncode) => {
        let prd = product(pid), taxFactor = rootGetters["FN/tax"](fncode);
        if(!taxFactor) return [null,0];
        let tax = _.toNumber(prd['taxfactor'+taxFactor]) + _.toNumber(prd['subtaxfactor'+taxFactor]), code = prd['taxcode'+taxFactor];
        return [code,tax];
    }
}
export function groups({dbTables}, {_tableDataById}) {
    return _tableDataById(dbTables[3])
}
export function list01({ dbTables },{ _tableDataByField }){
    return (num) => _.keys(_tableDataByField(dbTables[2],'g'+num));
}
export function list02({ dbTables },{ _tableDataFilter }){
    return (num,list01,list01num) => _.keys(_.keyBy(_tableDataFilter(dbTables[2],'g'+list01,list01num),'g'+num));
}
export function listProducts({dbTables}, {_tableDataFilter}) {
    return (lg1,g1,lg2,g2) => {
        let Products = _tableDataFilter(dbTables[2],'g'+lg1,g1);
        if(lg2 && g2 && _.toSafeInteger(g2) > 0) {
            let key = 'g'+lg2;
            Products = _.filter(Products,(product) => product[key] == g2)
        }
        return _.map(Products,'product');
    }
}

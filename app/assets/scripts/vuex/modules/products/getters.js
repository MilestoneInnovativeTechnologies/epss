import {product_image_path} from "../../../constants";

export function productTrans(state,getters,rootState,rootGetters) {
    return (product) => { return rootGetters['SPT/_tableDataFilter']('store_product_transactions','product',product) }
}
export function productPrice(state,{ _tableDataItem }) {
    return (product) => { return _tableDataItem('pricelist',product) }
}
export function productTax(state,{ _tableDataById }) {
    let tfStr = 'taxfactor' + ((__.TAX02 === 'Yes') ? '02' : '01');
    let factors = [tfStr,'sub'+tfStr];
    return (product) => { return _.sum(_.values(_.only(_.get(_tableDataById('products'),product),factors))) }
}
export function imagePath(state,getters,rootState){
    return [rootState['App'].url_web,product_image_path,''].join('/').replace(/\/+/g,'/').replace('http:/','http://');
}
export function product({ dbTables },{ _tableDataItem }){
    return (id) => _tableDataItem(dbTables[0],id);
}
export function tax(state, {product}, rootState, rootGetters) {
    return (pid,fncode) => {
        let prd = product(pid), taxFactor = rootGetters["FN/tax"](fncode);
        if(!taxFactor) return [null,0];
        let tax = _.toNumber(prd['taxfactor'+taxFactor]) + _.toNumber(prd['subtaxfactor'+taxFactor]), code = prd['taxcode'+taxFactor];
        return [code,tax];
    }
}
export function groups({dbTables}, {_stateDataById}) {
    return _stateDataById('group')
}
export function list01({ dbTables },{ _stateDataByField }){
    return (num) => _.keys(_stateDataByField('list','g'+num));
}
export function list02({ dbTables },{ _stateDataFilter }){
    return (num,list01,list01num) => _.keys(_.keyBy(_stateDataFilter('list','g'+list01,list01num),'g'+num));
}
export function listProducts({dbTables}, {_stateDataFilter}) {
    return (lg1,g1,lg2,g2) => {
        let Products = _stateDataFilter('list','g'+lg1,g1);
        if(lg2 && g2 && _.toSafeInteger(g2) > 0) {
            let key = 'g'+lg2;
            Products = _.filter(Products,(product) => product[key] == g2)
        }
        return _.map(Products,'product');
    }
}

export function details({ dbTables }, { _tableDataItemByKey }) {
    return (code) => _tableDataItemByKey(dbTables[0],'code',code)
}
export function tax(state,{ details }){
    return (code) => { let detail = details(code); return (!code || !detail || detail.tax !== 'Yes') ? null : detail.taxselection.substr(-2) }
}
export function itemTax(state,{ details },rootState,rootGetters){
    return (fncode,itemcode,taxselection) => {
        let fnDetails = details(fncode), itemDetails = rootGetters["Product/product"](itemcode), tax = 0;
        if(fnDetails.tax === 'Yes'){
            if(fnDetails.taxselection === 'Select' && !_.isNil(taxselection)) tax = getNum(taxselection);
            else if(_.includes(['Tax01','Tax02'],fnDetails.taxselection)) {
                let tFacStr = 'taxfactor' + fnDetails.taxselection.substr(-2);
                tax = getNum(itemDetails[tFacStr]) + getNum(itemDetails['sub'+tFacStr]);
            }
            else tax = 0;
        }
        return tax;
    }
}
export function getDiscount(state,{ details }){
    return (fncode,type,total,discount) => {
        let fnDetails = details(fncode), key = 'discount'+type;
        if(!fnDetails || fnDetails[key] === 'NotRequired') return 0;
        if(fnDetails[key] === 'Amount') return getNum(discount,0);
        if(fnDetails[key] === 'Percentage') return getNum(total,0) * (getNum(discount,0)/100);
    }
}
export function discount01(state,{ getDiscount }){
    return (code,total,discount) => getDiscount(code,'01',total,discount)
}
export function discount02(state,{ getDiscount }){
    return (code,total,discount) => getDiscount(code,'02',total,discount)
}
export function total(state,{ details,itemTax,discount01,discount02 },rootState,rootGetters){
    return (code,item,qty,extra) => {
        let fnDetails = details(code), itemDetails = rootGetters["Product/product"](item); extra = extra || {};
        let rate = (_.isNil(extra.rate)) ? getNum(itemDetails.price) : _.toNumber(extra.rate);
        let total = rate * getNum(qty,1); if(!code || !fnDetails) return total;
        let Discount01 = (fnDetails.discount01 !== 'NotRequired') ? discount01(code,total,getNum(extra.discount01,getNum(extra.discount,0))) : 0;
        total -= getNum(Discount01); let tax = itemTax(code,item,extra.tax); total += (total * tax);
        let Discount02 = (fnDetails.discount02 !== 'NotRequired') ? discount02(code,total,getNum(extra.discount02,getNum(extra.discount,0))) : 0;
        total -= getNum(Discount02);
        return total;
    }
}

function getNum(num,def){
    return _.isNaN(_.toNumber(num)) ? (def || 0) : _.toNumber(num);
}
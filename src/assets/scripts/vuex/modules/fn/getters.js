export function details({ dbTables }, { _tableDataItemByKey }) {
    return (code) => _tableDataItemByKey(dbTables[0],'code',code)
}
export function rateWithTax({ dbData,dbTables },{ details }){
    return _(dbData[dbTables[0]]).mapKeys('code').mapValues('ratewithtax').value();
}
export function tax(state,{ details }){
    return (code) => {
        let detail = details(code);
        if(__.GEOZONE && __.GEOZONE === 'Yes') {
            if(!code || !detail || !detail.user_type || detail.user_type !== 'EndUser') return '01';
            return '02';
        }
        return (!code || !detail || detail.tax !== 'Yes') ? null : detail.taxselection.substr(-2)
    }
}
export function taxRate(state,{ tax,details },rootState,rootGetters){
    return (fncode,itemcode,taxselection) => {
        let fnDetails = details(fncode); if(!fnDetails || fnDetails.tax === 'No') return 0;
        let itemDetails = rootGetters["Product/product"](itemcode)
        if(__.GEOZONE && __.GEOZONE === 'Yes') {
            let taxFactor = (!fnDetails.user_type || fnDetails.user_type !== 'EndUser') ? '01' : '02'
            let tFacStr = 'taxfactor' + taxFactor;
            return getNum(itemDetails[tFacStr]) + getNum(itemDetails['sub'+tFacStr]);
        } else {
            if(fnDetails.taxselection === 'Select' && !_.isNil(taxselection)) return getNum(taxselection);
            if(_.includes(['Tax01','Tax02'],fnDetails.taxselection)) {
                let tFacStr = 'taxfactor' + fnDetails.taxselection.substr(-2);
                return getNum(itemDetails[tFacStr]) + getNum(itemDetails['sub'+tFacStr]);
            } else return 0;
        }
    }
}
export function itemTax(state,{ details,taxRate },rootState,rootGetters){
    return (fncode,itemcode,taxselection) => {
        let fnDetails = details(fncode);
        return (fnDetails && fnDetails.tax === 'Yes') ? taxRate(fncode,itemcode,taxselection) : 0;
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
export function saleItem(state,{ details,itemTax,discount01,discount02 },rootState,rootGetters){
    return (code,item,qty,extra) => {
        let fnDetails = details(code), itemDetails = rootGetters["Product/product"](item), shift_docno = rootGetters["Shift/docno"],
            pid = itemDetails['id'], name = itemDetails['name'], narration = itemDetails['narration'], uom = itemDetails['uom']; extra = extra || {};
        let quantity = getNum(qty,1),rate,amount,dis01,tax,dis02,taxdisplay,disc,taxrate,total,taxrule = itemDetails['taxcode' + fnDetails.taxselection.substr(-2)];
        taxrate = itemTax(code,item,getNum(extra.tax));
        if(_.isNil(extra.rate)){
            let price = __.rate(getNum(itemDetails.price))
            rate = (fnDetails && fnDetails.ratewithtax && fnDetails.ratewithtax === 'Yes') ? __.rate(price*100/(100+(taxrate*100))) : price;
        } else rate = getNum(extra.rate);
        amount = __.amount(quantity * rate);
        dis01 = (fnDetails.discount01 !== 'NotRequired') ? discount01(code,amount,getNum(extra.discount01,getNum(extra.discount,0))) : 0;
        tax = __.amount((amount - dis01) * taxrate); taxdisplay = tax + '@' + taxrate*100 + '%';
        dis02 = (fnDetails.discount02 !== 'NotRequired') ? discount02(code,(amount-dis01),getNum(extra.discount02,getNum(extra.discount,0))) : 0;
        disc = dis01 + dis02; total = __.amount(amount + tax - disc);
        return { item,product:pid,pid,name,narration,product_name:name,uom,quantity,rate,amount,discount01:dis01,taxrule,taxrate,tax,taxdisplay,discount02:dis02,discount:disc,total,shift_docno };
    }
}
export function saleItemBasic(state,{ details,itemTax },rootState,rootGetters){
    return (code,item) => {
        let fnDetails = details(code), itemDetails = rootGetters["Product/product"](item),
            pid = itemDetails['id'], name = itemDetails['name'], narration = itemDetails['narration'], uom = itemDetails['uom'];
        let rate,taxrate,taxrule = itemDetails['taxcode' + fnDetails.taxselection.substr(-2)];
        rate = getNum(itemDetails.price);
        taxrate = itemTax(code,item);
        return { item,product:pid,pid,name,narration,product_name:name,uom,rate,taxrule,taxrate };
    }
}
export function shiftActive({ dbTables,dbData }) {
    return (code) => _.get(_.find(dbData[dbTables[0]],['code',code]),'shift_active') === 'Yes'
}

function getNum(num,def){
    return _.isNaN(_.toNumber(num)) ? (def || 0) : _.toNumber(num);
}
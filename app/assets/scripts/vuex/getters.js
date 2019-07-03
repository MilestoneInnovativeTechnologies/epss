export function user(state){ return state['User'].id }
export function _ref(state){ return () => ['U',state['User'].id,'T',moment().format('xS')].join('') }
export function date(){ return () => moment().format('YYYY-MM-DD') }
export function datetime(){ return () => moment().format('YYYY-MM-DD HH:mm:ss') }
export function docno(){
    return (format,object) => {
        let replaces = ['CMP','BR','FN','FY','AI'];
        return _.reduce(replaces,(format,key) => object[key] ? format.replace(`[${key}]`,object[key]) : format,format);
    }
}
export function abbreviations(state,getters){
    return (store,fycode,fncode) => {
        let str = _.get(getters['Stores/_tableDataById']('stores'),store);
        return _.zipObject(['FY','BR','CMP','FN'],[fycode,str.br_abr,str.co_abr,fncode]);
    }
}
export function total(){
    return (rate,qty,tax) => {
        rate = _.toNumber(rate); tax = _.toNumber(tax); qty = _.toNumber(qty); let ttl = rate * qty;
        return ttl + (ttl*tax);
    }
}
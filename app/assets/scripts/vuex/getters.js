export function user(state){ return state['User'].id }
export function client(state){ return state['App'].uuid }
export function uuid(state){ return state['App'].uuid }
export function _ref(state){ return () => ['U',state['User'].id,'T',moment().format('xS')].join('') }
export function date(){ return () => moment().format('YYYY-MM-DD') }
export function datetime(){ return () => moment().format('YYYY-MM-DD HH:mm:ss') }
export function startOfDay(){ return moment().startOf('day').format('X') }
export function startOfWeek(){ return moment().startOf('week').format('X') }
export function startOfMonth(){ return moment().startOf('month').format('X') }
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

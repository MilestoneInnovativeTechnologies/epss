export function user(state){ return state['User'].id }
export function client(state){ return state['App'].uuid }
export function uuid(state){ return state['App'].uuid }
export function _ref(state){
    return (n) => {
        n = n || 1; let user = state['User'].id, start = parseInt(moment().format('xS')), end = start + n;
        let _refs = _.map(_.range(start,end),T => ['U',user,'T',T].join(''));
        return (n === 1) ? _refs[0] : _refs;
    }
}
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
export function toDateTime(){ return (date) => date + ' ' + moment().format('HH:mm:ss') }
export function abbreviations(state,getters){
    return (store,fycode,fncode) => {
        let str = _.get(getters['Stores/_tableDataById']('stores'),store);
        return _.zipObject(['FY','BR','CMP','FN'],[fycode,str.br_abr,str.co_abr,fncode]);
    }
}
export function total(){
    return (rate,qty,tax,discount) => {
        discount = _.isNil(discount) ? 0 : _.toNumber(discount); tax = _.isNil(tax) ? 0 : _.toNumber(tax);
        qty = _.isNil(qty) ? 1 : _.toNumber(qty); rate = _.isNil(rate) ? 0 : _.toNumber(rate);
        let ttl = rate * qty;
        return ttl + (ttl*tax) - discount;
    }
}

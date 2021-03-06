export function get(state,{ processable,getAI },rootState,rootGetters) {
    return (store,fycode,fncode) => {
        let abr = rootGetters['abbreviations'](store,fycode,fncode);
        let data = processable(fncode,store);
        if(!data) { alert('Seems you don\'t have any reserved docno\'s remaining.'); return null; }
        let fn = rootGetters['FN/_tableDataItemByKey']('functiondetails','code',fncode);
        let AI = getAI(fn,data);
        return rootGetters['docno'](fn.format,{ ...abr,AI });
    }
}
export function processable(state,{ _tableDataByGroup }){
    return (fncode,store) => {
        let data = _.filter(_.get(_tableDataByGroup('fn_reserves','fncode'),fncode),['store',_.toString(store)]);
        let processing = _.filter(data,['progress','Processing']);
        let awaiting = _.filter(data,['progress','Awaiting']);
        if(_.isEmpty(processing) && _.isEmpty(awaiting)) return null;
        return _.head(_.isEmpty(processing) ? awaiting : processing)
    }
}
export function getAI(){
    return (fn,data) => {
        let dLen = _.get(fn,'digit_length');
        let nNum = _.toSafeInteger(data.start_num) + _.toSafeInteger(data.current);
        return _.padStart(nNum,dLen,'0');
    }
}
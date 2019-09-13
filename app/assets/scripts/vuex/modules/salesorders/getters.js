export function progressCount({ list }){
    return _.countBy(list,'progress')
}
export function docno(state,getters,rootState,rootGetters){
    return (fncode,fycode) => {
        let store = rootGetters['User/stores'][0];
        return rootGetters['Reserves/get'](store,fycode,fncode);
    }
}
export function salesOrder({ dbTables }, { _tableDataItemByKey }) {
    return (_ref) => _tableDataItemByKey(dbTables[0],'_ref',_ref)
}
export function salesOrderItems({ dbTables }, { _tableDataFilter }) {
    return (_ref) => _tableDataFilter(dbTables[1],'so',_ref)
}
export function sptTransaction(state,{ _tableDataFilter }) {
    return (spt) => _.get(_.head(_tableDataFilter('transaction_details','spt',spt)),'transaction');
}
export function sptTransactionDetails(state,{ sptTransaction,_tableDataItemByKey }) {
    return (spt) => { return _tableDataItemByKey('transactions','_ref',sptTransaction(spt)) };
}

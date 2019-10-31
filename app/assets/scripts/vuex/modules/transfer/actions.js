export function out({ dispatch },data){
    let { transactions,transaction_details } = data;
    return new Promise(resolve => {
        dispatch('Transaction/save',{ transactions, transaction_details },{ root:true }).then(out => {
            dispatch('_insert',{ table:'stock_transfer',data:[{ out }] },{ root:true }).then(activity => resolve(transactions.docno));
        });
    })
}
export function saveIn({ dispatch },data){
    let { transactions,transaction_details,out } = data;
    return new Promise(resolve => {
        dispatch('Transaction/save',{ transactions, transaction_details },{ root:true }).then(_ref => {
            dispatch('_update',{ table:'stock_transfer',condition:{ out },data:{ in:_ref } },{ root:true }).then(activity => resolve(transactions.docno));
        });
    })
}
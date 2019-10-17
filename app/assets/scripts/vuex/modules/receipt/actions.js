export function create({ rootGetters,dispatch },data){
    return new Promise((resolve,reject) => {
        let fncode = rootGetters['Settings/setting'](_.upperCase(data.mode)+'RECEIPTFNCODE'), user = rootGetters.user,
            docno = rootGetters['Reserves/get'](data.store,data.fycode,fncode), _ref = rootGetters._ref();
        let insData = Object.assign({},
            _.pick(data,['customer','mode','fycode','date','amount']),
            data.mode === 'Cash' ? {} : _.pick(data,['bank','cheque','cheque_date']),
            { fncode,user,docno,_ref,status:'Active' }
        );
        dispatch('_insert',{ table:'receipts',data:insData },{ root:true }).then(id => {
            dispatch('Reserves/incReserve',{ fncode,store:data.store },{ root:true });
            resolve(_ref);
        })
    });
}
export function save({ dispatch },data){
    let table = 'receipts', { fncode,store } = data;
    return new Promise(resolve => {
        dispatch('_insert',{ table,data },{ root:true }).then(activity => {
            dispatch('Reserves/incReserve',{ fncode,store },{ root:true });
            resolve(activity['_ref']);
        })
    });
}
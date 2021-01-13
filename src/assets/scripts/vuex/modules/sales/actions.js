export function sale({ dispatch,commit,rootGetters },{ transaction,details,spt,reserve }){
    return new Promise((resolve,reject) => {
        Promise.all([dispatch('_insert',{ table:'store_product_transactions',data:spt },{ root:true }),dispatch('_insert',{ table:'transactions',data:transaction },{ root:true })]).then(()=>{
            dispatch('_insert',{ table:'transaction_details',data:details },{ root:true }).then((result) => {
                dispatch('Reserves/increment',rootGetters['Reserves/processable'](reserve.fncode,reserve.store)['id'],{ root:true });
                resolve(transaction._ref);
            });
        })
    })
}
export function sReturn({ dispatch,commit,rootGetters },{ transactions,transaction_details,store_product_transactions }){
    return new Promise((resolve,reject) => {
        Promise.all([dispatch('_insert',{ table:'store_product_transactions',data:store_product_transactions },{ root:true }),dispatch('_insert',{ table:'transactions',data:transactions },{ root:true })]).then(()=>{
            dispatch('_insert',{ table:'transaction_details',data:transaction_details },{ root:true }).then((result) => {
                dispatch('Reserves/increment',rootGetters['Reserves/processable'](transactions.fncode,store_product_transactions[0].store)['id'],{ root:true });
                resolve(transactions._ref);
            });
        })
    })
}
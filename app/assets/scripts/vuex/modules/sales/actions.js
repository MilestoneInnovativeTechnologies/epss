export function sale({ dispatch,commit,rootGetters },{ transaction,details,spt,reserve }){
    return new Promise((resolve,reject) => {
        Promise.all([dispatch('_insert',{ table:'store_product_transactions',data:spt },{ root:true }),dispatch('_insert',{ table:'transactions',data:transaction },{ root:true })]).then(()=>{
            dispatch('_insert',{ table:'transaction_details',data:details },{ root:true });
            dispatch('Reserves/increment',rootGetters['Reserves/processable'](reserve.fncode,reserve.store)['id'],{ root:true });
            resolve(transaction._ref);
        })
    })
}
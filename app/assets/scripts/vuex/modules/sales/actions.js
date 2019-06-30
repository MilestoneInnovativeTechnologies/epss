export function sale({ dispatch },{ transaction,details,spt }){
    return new Promise((resolve,reject) => {
        Promise.all([dispatch('_insert',{ table:'store_product_transactions',data:spt },{ root:true }),dispatch('_insert',{ table:'transactions',data:transaction },{ root:true })]).then(()=>{
            dispatch('_insert',{ table:'transaction_details',data:details },{ root:true });
            resolve(transaction._ref);
        })
    })
}
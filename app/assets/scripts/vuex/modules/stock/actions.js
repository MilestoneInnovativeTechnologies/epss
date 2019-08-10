export function transferOut({ dispatch },data){
    return new Promise((resolve, reject) => {
        dispatch('entry',data).then(({ store,fncode,transactions }) => {
            dispatch('Reserves/incReserve',{fncode, store},{ root:true });
            dispatch('_insert',{ table:'stock_transfer',data:{ out:transactions._ref } },{ root:true });
            resolve(transactions);
        })
    });
}
export function transferIn({ dispatch },data){
    return new Promise((resolve, reject) => {
        dispatch('entry',data).then(({ store,fncode,transactions }) => {
            Promise.all([
                dispatch('Reserves/incReserve',{fncode, store},{ root:true }),
                dispatch('_update',{ table:'stock_transfer',data:{ in:transactions._ref },condition:{ out:data.id } },{ root:true }),
            ]).then(() => {
                dispatch('Sync/priorSyncQueue',['transactions','store_product_transactions','transaction_details','stock_transfer','fn_reserves'],{ root:true });
            });
            resolve(transactions);
        })
    });
}
export function entry({ dispatch },{ transactions,transaction_details,store_product_transactions }){
    return new Promise((resolve, reject) => {
        Promise.all([
            dispatch('_insert',{ table:'transactions',data:transactions },{ root:true }),
            dispatch('_insert',{ table:'store_product_transactions',data:store_product_transactions },{ root:true }),
        ]).then(() => {
            dispatch('_insert',{ table:'transaction_details',data:transaction_details },{ root:true }).then(() => {
                resolve({ transactions,store:store_product_transactions[0]['store'],fncode:transactions.fncode })
            });
        })
    })
}
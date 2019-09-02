export function order({ dispatch,commit,rootGetters },{ master,details }){
    return new Promise((resolve,reject) => {
        Promise.all([dispatch('_insert',{ table:'sales_order',data:master },{ root:true }),dispatch('_insert',{ table:'sales_order_items',data:details },{ root:true })]).then(()=>{
            let fncode = master.fncode, store = rootGetters['User/stores'][0];
            dispatch('Reserves/increment',rootGetters['Reserves/processable'](fncode,store)['id'],{ root:true });
            resolve(master._ref);
        })
    })
}
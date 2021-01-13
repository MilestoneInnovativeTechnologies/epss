export function drop({ dispatch },{ shift,cash }){
    let table = 'shift_transactions', data = { fncode: 'SDRP', cancel: 'No', shift, cash, credit:0, card:0, digitalwallet:0, cheque:0, ssinit:'Yes' };
    return new Promise(resolve => {
        dispatch('_insert',{ table,data },{ root:true }).then(activity => resolve(activity))
    });
}
export function shiftClose({ dispatch,rootGetters },{ shift,closing }){
    let table = 'shift', condition = { _ref:shift },  data = { end_date:rootGetters['datetime'](),closing,status:'Completed' };
    return new Promise(resolve => {
        dispatch('_update',{ table,data,condition },{ root:true }).then(activity => resolve(activity))
    });
}
export function shiftCreate({ dispatch,rootGetters,rootState },opening){
    let table = 'shift', store = rootState.Stores.dbData.stores.filter(store => store.id == rootState['default_store'])[0], user = rootGetters['user'],
        data = { cocode:store.cocode,brcode:store.brcode,cancel:'No',closing:0,difference:0,docno:'U'+user+'T'+moment().format('X'),fncode:'SHF',fycode:rootState['default_fycode'],
            opening,ssinit:'Yes',start_date:rootGetters['datetime'](),status:'Approved',user,_ref:rootGetters['_ref']() };
    return new Promise(resolve => {
        dispatch('_insert',{ table,data },{ root:true }).then(activity => resolve(activity));
    });
}
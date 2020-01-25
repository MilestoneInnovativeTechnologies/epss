export function drop({ dispatch },{ shift,cash }){
    let table = 'shift_transactions', data = { fncode: 'SDRP', cancel: 'No', shift, cash, credit:0, card:0, digitalwallet:0, cheque:0 };
    return new Promise(resolve => {
        dispatch('_insert',{ table,data },{ root:true }).then(activity => {
            resolve(activity);
        })
    });
}
export function shiftClose({ dispatch,rootGetters },{ shift,closing }){
    let table = 'shift', condition = { _ref:shift },  data = { end_date:rootGetters['datetime'](),closing,status:'Completed' };
    return new Promise(resolve => {
        dispatch('_update',{ table,data,condition },{ root:true }).then(activity => {
            resolve(activity);
        })
    });
}
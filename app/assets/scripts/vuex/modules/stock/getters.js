export function outDocno(state,getters,rootState,rootGetters){
    return (storeid,fycode,fncode) => {
        fncode = fncode || rootGetters['Settings/setting']('STOCKTRANSFEROUTFNCODE');
        return rootGetters['Reserves/get'](storeid,fycode,fncode);
    }
}

export function b2b(state,getters,rootState,rootGetters){ return rootGetters['Settings/setting']('SALESB2BFNCODE') }
export function b2c(state,getters,rootState,rootGetters){ return rootGetters['Settings/setting']('SALESB2CFNCODE') }
export function docno(state,getters,rootState,rootGetters){
    return (storeid,fyid,fncode) => {
        return rootGetters['Reserves/get'](storeid,fyid,fncode);
    }
}
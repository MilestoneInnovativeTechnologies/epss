export function progressCount({ list }){
    return _.countBy(list,'progress')
}
export function docno(state,getters,rootState,rootGetters){
    return (fncode,fyid) => {
        let store = rootGetters['User/stores'][0];
        return rootGetters['Reserves/get'](store,fyid,fncode);
    }
}
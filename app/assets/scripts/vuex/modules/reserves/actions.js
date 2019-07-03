export function increment({ dispatch,getters,state },id){
    let data = {}, rData = getters._tableDataItem(state.dbTables[0],id);
    data['current'] = _.toNumber(rData.current)+1; if(data['current'] > 0 && rData.progress === 'Awaiting') data['progress'] = 'Processing';
    if((_.toNumber(rData.start_num) + data['current']) >= _.toNumber(rData.end_num)) data['progress'] = 'Completed';
    dispatch('_update',{ table:'fn_reserves',data,condition:{ id } },{ root:true });
}
export function incReserve({ getters,dispatch }, {fncode, store}) {
    dispatch('increment',getters.processable(fncode,store)['id']);
}
export function save({ dispatch },data){
    let tables = _.keys(data), { fncode,store,_ref } = data[tables[0]];
    return new Promise(resolve => {
        _.forEach(tables,table => dispatch('_insert',{ table,data:data[table] },{ root:true }));
        dispatch('Reserves/incReserve',{ fncode,store },{ root:true });
        resolve(_ref);
    })
}

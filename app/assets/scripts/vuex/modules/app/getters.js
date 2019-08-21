export function get(state,{ _tableDataByField }){
    let data = _tableDataByField('app','name');
    return (name) => data[name].detail
}
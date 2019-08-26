export function get({ dbTables },{ _tableDataByField }){
    let data = _tableDataByField(dbTables[0],'name');
    return (name) => (data && _.has(data,name)) ? data[name].detail : null
}
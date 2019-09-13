export function details({ dbTables }, { _tableDataItemByKey }) {
    return (code) => _tableDataItemByKey(dbTables[0],'code',code)
}
export function tax(state,{ details }){
    return (code) => { let detail = details(code); return (!code || !detail || detail.tax !== 'Yes') ? null : detail.taxselection.substr(-2) }
}

export function incomplete(state,{ _tableDataFilter }) {
    return _tableDataFilter('sales_order','progress','Incomplete')
}
export function partial(state,{ _tableDataFilter }) {
    return _tableDataFilter('sales_order','progress','Partial')
}
export function pending(state,{ Incomplete,Partial }) {
    return _.concat(Incomplete,Partial)
}

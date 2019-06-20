export function NameId(state,{ _tableDataByIdName }) {
    return  _.invert(_tableDataByIdName('product_transaction_natures'))
}

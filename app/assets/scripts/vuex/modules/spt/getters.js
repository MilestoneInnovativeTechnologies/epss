export function products(state,{ _tableDataFilter }) {
    return (store) => _tableDataFilter('store_product_transactions','store',store)
}

import {fetch_all_products_with_stock} from "../../../queries";

export default {
    dbTables: ['products'],
    dbQuery: { products: fetch_all_products_with_stock },
    cacheTables: ['products'],
    transactions: {},
    list: [],
    group: [],
}

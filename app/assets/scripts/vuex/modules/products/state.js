import {fetch_all_products} from "../../../queries";

export default {
    dbTables: ['products'],
    dbQuery: { products: fetch_all_products },
    cacheTables: ['products'],
    transactions: {},
    list: [],
    group: [],
}

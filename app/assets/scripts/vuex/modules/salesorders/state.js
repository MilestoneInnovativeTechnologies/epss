import {login_user_customer_recent_sales_orders} from "../../../queries";

export default {
    dbTables:['sales_order'],
    dbQuery: { sales_order:login_user_customer_recent_sales_orders },
    cacheTables: ['sales_order'],
    recent: [],
    list: [],
    products:{},
}

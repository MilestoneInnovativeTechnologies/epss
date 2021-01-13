import {login_user_area_customers} from "../../../queries";

export default {
    dbTables:['users'],
    dbQuery: { users:login_user_area_customers },
    cacheTables: ['users'],
    outstanding:{},
    list:[],
    pending_sales_order: {}
}

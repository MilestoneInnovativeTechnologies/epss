import {login_user_stores_recent_sales} from "../../../queries";

export default {
    dbTables: ['transactions'],
    dbQuery: { 'transactions':login_user_stores_recent_sales },
    cacheTables: ['transactions'],
    detail:{},
    recent: {},
}

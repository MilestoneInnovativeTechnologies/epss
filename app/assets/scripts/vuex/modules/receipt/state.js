import {login_user_recent_receipts} from "../../../queries";

export default {
    dbTables: ['receipts'],
    dbQuery: { 'receipts':login_user_recent_receipts },
    cacheTables: ['receipts'],
    list: [],
    recent: {},
}

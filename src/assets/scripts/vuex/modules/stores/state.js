import {login_user_assigned_stores} from "../../../queries";

export default {
    dbTables:['stores'],
    dbQuery: { stores:login_user_assigned_stores },
    dbData: { stores:[] },
    detail:{},
    stock:{},
    list:[],
}

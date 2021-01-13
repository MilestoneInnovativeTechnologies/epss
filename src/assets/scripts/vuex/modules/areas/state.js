import {login_user_assigned_areas} from "../../../queries";

export default {
    dbTables:['areas'],
    dbQuery: { areas:login_user_assigned_areas },
    list:[],
}

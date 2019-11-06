import {
    add_new_table_for_sync,
    update_table_timing,
    remove_user_tables_from_sync,
} from '../../mutation-types';
import {table_information_db_table_name} from '../../../constants';

export default {
    [add_new_table_for_sync](state, tblObj) {
        state.tables = Object.assign({},state.tables,_.set({},tblObj.table,_.pick(tblObj,['type','direction'])));
        state.times = Object.assign({},state.times,_.set({},tblObj.table,_.pick(tblObj,['create','update','download','upload'])));
    },
    [update_table_timing](state,{ table,type,time }) {
        time = time || now(); state.times[table][type] = time;
        DB.update(table_information_db_table_name,{ table },_.zipObject([type],[time]));
    },
    [remove_user_tables_from_sync](state) {
        let newTables = {}, oldTables = state.tables;
        _.forEach(oldTables, (prop, tbl) => { if(prop.type === 'APP') newTables[tbl] = prop; });
        state.tables = newTables;
    }
};

function now(){ return __.now(); }
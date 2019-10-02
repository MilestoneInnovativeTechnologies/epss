import {
    add_new_table_for_sync,
    update_table_timing,
    add_to_sync_download_queue,
    remove_first_sync_download_queue_item,
    increment_sync_download_failure_count, remove_user_tables_from_sync,
} from '../../mutation-types';
import {table_information_db_table_name} from '../../../constants';

export default {
    [add_new_table_for_sync](state, tblObj) {
        state.tables = Object.assign({},state.tables,_.set({},tblObj.table,_.pick(tblObj,['type','direction'])));
        state.times = Object.assign({},state.times,_.set({},tblObj.table,_.pick(tblObj,['create','update','download','upload'])));
    },
    [add_to_sync_download_queue](state, table) {
        let tables = Array.isArray(table) ? table : [table], sTables = state.queue_download;
        for(let x in tables) if(sTables.indexOf(tables[x]) === -1) state.queue_download.push(tables[x]);
    },
    [remove_first_sync_download_queue_item](state) {
        state.queue_download.shift();
    },
    [increment_sync_download_failure_count](state,table) {
        state.failure_count = Object.assign({},state.failure_count,_.set({},table,_.toSafeInteger(_.get(state.failure_count,table))+1))
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
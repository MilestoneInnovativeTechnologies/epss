import {
    add_new_table_for_sync,
    add_to_app_sync_queue,
    processing_queue,
    finish_processing_queue,
    set_repeat_failed_timeout,
    update_table_timing,
    set_new_sync_time_out,
    add_to_sync_download_queue,
    remove_first_sync_download_queue_item,
    increment_sync_download_failure_count,
} from '../../mutation-types';
import {gap_between_sync_queue_seconds, table_information_db_table_name} from '../../../constants';

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
    [add_to_app_sync_queue](state, { table,at,type }) {
        if(state.processing['table'] === table) return;
        let cTime = _.toSafeInteger(_.findKey(state.queue,['table',table]));
        if (cTime) { if (cTime <= _.toSafeInteger(at)) return;
            state.queue_index = _.without(state.queue_index,cTime);
            delete state.queue[cTime];
        }
        let token = getNextPossibleQueueTokenAfter(at,state.queue_index);
        state.queue_index.push(token); state.queue_index.sort();
        state.queue = Object.assign({},state.queue,_.fromPairs([[token,{ table,type }]]));
        DB.update(table_information_db_table_name,{ table },{ next:token });
    },
    [processing_queue](state, { item,index }) {
        state.processing = item; delete state.queue[index];
        state.queue_index = _.without(state.queue_index,index);
    },
    [finish_processing_queue](state) {
        state.processing = {}; state.success = ''; state.fail = '';
        clearTimeout(state.repeat_failed_timeout);
    },
    [set_repeat_failed_timeout](state,tm) {
        state.set_repeat_failed_timeout = tm;
    },
    [set_new_sync_time_out](state,timeout) {
        clearTimeout(state.time_out); state.time_out = timeout;
    }
};

function getNextPossibleQueueTokenAfter(token,queue){
    const adjacent = gap_between_sync_queue_seconds;
    let factor = _.floor(adjacent/2),
        myTokens = _.range(token-factor,token+factor,1),
        intersects = _.intersection(myTokens,queue);
    if(_.isEmpty(intersects)) return token;
    return getNextPossibleQueueTokenAfter(token+(adjacent),queue);
}

function now(){ return __.now(); }
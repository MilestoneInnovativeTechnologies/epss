import {
    add_new_table_for_sync,
    add_to_app_sync_queue,
    processing_queue,
    set_sync_base_url,
    finish_processing_queue,
    set_repeat_failed_timeout, update_table_timing, set_new_sync_time_out, update_sync_user_details,
} from '../../mutation-types';
import { gap_between_sync_queue_seconds } from '../../constants';

export default {
    [add_new_table_for_sync](state, { table,up,down,type }) {
        Object.assign(state.tables,_.zipObject([table],[{ up:_.toSafeInteger(parseInt(up)),down:_.toSafeInteger(parseInt(down)),type }]));
    },
    [add_to_app_sync_queue](state, { table,at,type }) {
        let token = getNextPossibleQueueTokenAfter(at,state.queue_index);
        state.queue_index.push(token); state.queue_index.sort();
        Object.assign(state.queue,_.fromPairs([[token,{ table,type }]]))
    },
    [processing_queue](state, { item,index }) {
        state.processing = item; delete state.queue[index];
        state.queue_index = _.without(state.queue_index,index);
    },
    [set_sync_base_url](state, { data,uuid }) {
        let url = _.find(data,{ name:'url_interact' }).detail;
        state.url = [url,'sync',uuid,''].join('/');
        state.client = uuid;
    },
    [finish_processing_queue](state) {
        state.processing = {}; state.success = ''; state.fail = '';
        clearTimeout(state.repeat_failed_timeout);
    },
    [set_repeat_failed_timeout](state,tm) {
        state.set_repeat_failed_timeout = tm;
    },
    [update_table_timing](state,{ table,type,time }) {
        Object.assign(state.time,_.zipObject([table],[_.zipObject([type],[time])]));
    },
    [set_new_sync_time_out](state,timeout) {
        clearTimeout(state.time_out); state.time_out = timeout;
    },
    [update_sync_user_details](state,{ id }) {
        state.user = id;
    },
};

function getNextPossibleQueueTokenAfter(token,queue){
    const adjacent = gap_between_sync_queue_seconds;
    let factor = _.floor(adjacent/2),
        myTokens = _.range(token-factor,token+factor,1),
        intersects = _.intersection(myTokens,queue);
    if(_.isEmpty(intersects)) return token;
    return getNextPossibleQueueTokenAfter(token+(adjacent),queue);
}
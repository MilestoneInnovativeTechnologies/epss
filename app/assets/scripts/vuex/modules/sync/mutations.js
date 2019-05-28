import {
    add_new_app_table,
    add_to_app_sync_queue,
    processing_queue,
    set_sync_base_url,
    finish_processing_queue,
    update_last_sync_time, set_repeat_failed_timeout
} from '../../mutation-types';
import { gap_between_sync_queue_seconds } from '../../constants';

export default {
    [add_new_app_table](state, { table,up,down }) {
        Object.assign(state.app_tables,_.zipObject([table],[{ up:_.toSafeInteger(parseInt(up)*60),down:_.toSafeInteger(parseInt(down)*3600) }]));
    },
    [add_to_app_sync_queue](state, { table,at }) {
        let token = getNextPossibleQueueTokenAfter(at,state.queue_index);
        state.queue_index.push(token); state.queue_index.sort();
        Object.assign(state.queue,_.fromPairs([[token,{ table,type:'APP' }]]))
    },
    [processing_queue](state, { item,index }) {
        state.processing = item; delete state.queue[index];
        state.queue_index = _.without(state.queue_index,index);
    },
    [set_sync_base_url](state, { data,uuid }) {
        let url = _.find(data,{ name:'url_interact' }).detail;
        state.url = [url,'sync',uuid,''].join('/');
    },
    [finish_processing_queue](state) {
        state.processing = {}; clearTimeout(state.repeat_failed_timeout);
    },
    [update_last_sync_time](state,{ table,time }) {
        Object.assign(state.time,_.fromPairs([[table,time]]))
    },
    [set_repeat_failed_timeout](state,tm) {
        state.set_repeat_failed_timeout = tm;
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
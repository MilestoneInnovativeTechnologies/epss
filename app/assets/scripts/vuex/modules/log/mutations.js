import { add_message_to_log_queue } from '../../mutation-types';

export default {
    [add_message_to_log_queue](state, msg) {
        if(_.isNumber(msg) || _.isString(msg)) state.queue.unshift(msg);
        else state.queue.unshift(JSON.parse(msg).toString());
    },
};

import {increment_upload_retry_count, set_latest_upload_queue_id, set_state_data} from '../../mutation-types';

export default {
    [set_latest_upload_queue_id](state, id) { if(id) state.latest = id; },
    [set_state_data](state, { key,value }) { state[key] = value; },
    [increment_upload_retry_count](state) { state['retry_count']++; },
};

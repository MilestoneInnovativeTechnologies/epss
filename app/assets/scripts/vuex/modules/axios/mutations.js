import {
    add_configuration_to_server_queue,
    start_process_queue,
    initiate_processing_transfer,
    finalize_processing_transfer,
    finalize_failed_transfer, set_connectivity_availability
} from '../../mutation-types';

export default {
    [set_connectivity_availability]({ connection },status) { connection = status },
    [add_configuration_to_server_queue](state, { config,success,fail }) {  state.queue.push(_.assign(config,state.config,{ success,fail })); },
    [start_process_queue](state) { state.processing = state.queue.shift(); state.success = state.processing.success; delete state.processing.success; state.fail = state.processing.fail; delete state.processing.fail },
    [initiate_processing_transfer](state) { state.transfer = true; },
    [finalize_processing_transfer](state) { state.processing = {}; state.transfer = false; state.success = ''; state.fail = ''; },
    [finalize_failed_transfer](state) { state.queue_failed.push(_.assign({ config: state.processing }, { success: state.success }, { fail: state.fail }));  state.transfer = false; state.processing = {}; state.success = ''; state.fail = ''; },
};

function toKeyedData(data){ return _.mapValues(_.keyBy(data,'name'),'detail'); }
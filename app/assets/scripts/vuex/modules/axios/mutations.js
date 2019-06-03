import {
    add_configuration_to_server_queue,
    start_process_queue,
    initiate_processing_transfer,
    finalize_processing_transfer,
    finalize_failed_transfer, populate_axios_url_data, set_connectivity_availability
} from '../../mutation-types';

export default {
    [set_connectivity_availability]({ connection },status) { connection = status },
    [add_configuration_to_server_queue](state, { config,success }) {  state.queue.push(_.assign(config,state.config,{ success })); },
    [start_process_queue](state) { state.processing = state.queue.shift(); state.success = state.processing.success; delete state.processing.success },
    [initiate_processing_transfer](state) { state.transfer = true; },
    [finalize_processing_transfer](state) { delete state.processing; state.transfer = false; },
    [finalize_failed_transfer](state) { state.queue_failed.push(_.assign({ config: state.processing }, { success: state.success }));  state.transfer = false; state.processing = {}; },
    [populate_axios_url_data](state,{ data,uuid }){
        state.client = uuid; data = toKeyedData(data);
        state.url_interact = data.url_interact; state.url_api = data.url_api;
        state.url_sync = [data.url_interact,uuid,''].join('/'); state.url_api = data.url_api;
        state.sync_config.url = [data.url_interact,'sync',uuid].join('/');
    }
};

function toKeyedData(data){ return _.mapValues(_.keyBy(data,'name'),'detail'); }
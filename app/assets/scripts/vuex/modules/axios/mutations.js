import {
    add_configuration_to_server_queue,
    start_process_queue,
    initiate_processing_transfer,
    finalize_processing_transfer,
    finalize_failed_transfer, populate_axios_url_data, set_connectivity_availability, update_axios_user_details
} from '../../mutation-types';

export default {
    [set_connectivity_availability]({ connection },status) { connection = status },
    [add_configuration_to_server_queue](state, { config,success,fail }) {  state.queue.push(_.assign(config,state.config,{ success,fail })); },
    [start_process_queue](state) { state.processing = state.queue.shift(); state.success = state.processing.success; delete state.processing.success; state.fail = state.processing.fail; delete state.processing.fail },
    [initiate_processing_transfer](state) { state.transfer = true; },
    [finalize_processing_transfer](state) { state.processing = {}; state.transfer = false; state.success = ''; state.fail = ''; },
    [finalize_failed_transfer](state) { state.queue_failed.push(_.assign({ config: state.processing }, { success: state.success }, { fail: state.fail }));  state.transfer = false; state.processing = {}; state.success = ''; state.fail = ''; },
    [populate_axios_url_data](state,{ data,uuid }){
        state.client = uuid; data = toKeyedData(data);
        state.url_interact = data.url_interact; state.url_api = data.url_api;
        state.url_sync = [data.url_interact,uuid,''].join('/'); state.url_api = data.url_api;
        state.sync_config.url = [data.url_interact,'sync',uuid].join('/');
    },
    [update_axios_user_details](state,{ id,api_token }){
        state.api_config.params._user = id; state.api_config.params.token = api_token;
    }
};

function toKeyedData(data){ return _.mapValues(_.keyBy(data,'name'),'detail'); }
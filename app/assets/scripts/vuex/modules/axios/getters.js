export function queue_count(state) { return state.queue.length; }
export function url_api(state,getters,rootState) { let url_api = rootState['App'].url_api; return (path) => [_.trim(url_api,'\\/'),_.trim(path,'\\/')].join('/'); }
export function api_config(state,getters,rootState) {
    let user = rootState['User'], config = state.api_config;
    config.params.token = user.api_token;
    config.data._user = user.id;
    return config;
}
export function isFile(state) { return _.has(state,'processing.request.url'); }
export function processing_url(state,getters) { return (getters.isFile) ? state.processing.request.url : state.processing.url; }
export function connection(state,getters,rootState) { return rootState.connection }

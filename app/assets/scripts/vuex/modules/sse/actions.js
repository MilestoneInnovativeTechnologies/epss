import {SSE} from "nativescript-sse";

let reConnectMinDelay = 10,connection = false;
let eventSource = null;
let debounceEventSource = null;

export function init(ctx) {
    let func = _.bind(doEventSource,ctx);
    debounceEventSource = _.debounce(func,reConnectMinDelay * 1000,{ leading:true });
    ctx.state.connection['init'] = __.time();
}

export function startEventSource({ getters }){
    let url = getPreparedSSEUrl(getters.SSEUrl,getters.SYNCTables);
    if(connection && url && debounceEventSource) debounceEventSource(url);
}

export function onConnectionChange({ dispatch,state },status){
    state.connection['connection_status'] = status; state.connection['connection_changed'] = __.time();
    connection = status; if(status) return dispatch('startEventSource');
}

export function syncTableChanged({ dispatch,state },tables){
    dispatch('startEventSource'); state.connection['table_changed'] = __.time(); state.connection['tables'] = __.time();
}

function getPreparedSSEUrl(baseURL,tables){
    if(!baseURL || !tables || tables.length === 0) return null;
    let joinStr = '&tables[]=';
    return baseURL + joinStr.replace('&','?') + tables.join(joinStr);
}

function purifySSEDataMessage(data){
    let message = _.trim(data.object.message.data); if(_.isEmpty(message) || message.substr(0,1) !== '[' || message.substr(-1,1) !== ']') return [];
    return JSON.parse(message);
}

function clearEventSource(){
    if(eventSource !== null) eventSource.close();
    return eventSource = null;
}

function doEventSource(url){
    clearEventSource();
    this.state.connection['connected'] = __.time(); this.state.connection['url'] = url;
    let message = _.bind(esOnMessage,this), error = _.bind(esOnError,this);
    eventSource = new SSE(url);
    eventSource.events.on('onMessage',data => message(data));
    eventSource.events.on('onError', data => error(data));
}

function esOnMessage(data){
    this.state.connection['message'] = __.time();
    this.state.connection['message_count']++;
    let tables = purifySSEDataMessage(data);
    this.dispatch('triggerEventSubscribers',{ event:'SSEMonitor',payload:tables },{ root:true });
}

function esOnError(){
    this.state.connection['error'] = __.time();
    this.state.connection['error_count']++;
    this.dispatch('startEventSource');
}

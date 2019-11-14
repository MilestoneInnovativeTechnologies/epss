import {SSE} from "nativescript-sse";

let reConnectMinDelay = 10,connection = false;
let eventSource = null;
const EST = { Connected:null,Error:null,Message:null,Url:null };
let debounceEventSource = null;

export function init(ctx) {
    let func = _.bind(doEventSource,ctx);
    debounceEventSource = _.debounce(func,reConnectMinDelay * 1000,{ leading:true })
}

export function startEventSource({ getters }){
    let url = getPreparedSSEUrl(getters.SSEUrl,getters.SYNCTables);
    if(connection && url && debounceEventSource) debounceEventSource(url);
}

export function onConnectionChange({ dispatch },status){
    connection = status; if(status) return dispatch('startEventSource');
}

export function syncTableChanged({ dispatch },tables){
    dispatch('startEventSource');
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
    let message = _.bind(esOnMessage,this), error = _.bind(esOnError,this);
    eventSource = new SSE(url); EST.Connected = __.now(); EST.Url = url;
    eventSource.events.on('onMessage',data => message(data));
    eventSource.events.on('onError', data => error(data));
}

function esOnMessage(data){
    EST.Message = __.now();
    let tables = purifySSEDataMessage(data);
    this.dispatch('triggerEventSubscribers',{ event:'SSEMonitor',payload:tables },{ root:true });
}

function esOnError(){
    EST.Error = __.now(); EST.Connected = null;
    this.dispatch('startEventSource');
}

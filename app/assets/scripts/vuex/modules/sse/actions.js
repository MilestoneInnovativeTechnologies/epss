import {SSE} from "nativescript-sse";

let reConnectMinDelay = 3,connection = false,timeOut = 0;
let eventSource = null;
const EST = { Connected:null,Error:null,Message:null,Url:null };

export function restartEventSourceDelayed({ dispatch }){
    clearTimeout(timeOut); clearEventSource();
    timeOut = setTimeout(() => dispatch('restartEventSource'),reConnectMinDelay*1000)
}

export function restartEventSource({ dispatch }){
    clearEventSource(); dispatch('startEventSource');
}

export function startEventSource({ dispatch,getters }){
    if(!connection) return;
    let url = getPreparedSSEUrl(getters.SSEUrl,getters.SYNCTables);
    if(url && (EST.Url !== url || (__.now() - _.toSafeInteger(EST.Connected)) > 3)) return dispatch('processEventSource',url);
}

export function processEventSource({dispatch}, url) {
    eventSource = new SSE(url); EST.Connected = __.now();
    eventSource.events.on('onMessage', (data) => {
        EST.Message = __.now();
        let tables = purifySSEDataMessage(data);
        dispatch('triggerEventSubscribers',{ event:'SSEMonitor',payload:tables },{ root:true });
    });
    eventSource.events.on('onError', (data) => {
        EST.Error = __.now(); EST.Connected = null;
        dispatch('restartEventSourceDelayed');
    });
}

export function onConnectionChange({ dispatch },status){
    connection = status;
    if(status) return dispatch('restartEventSource');
}

export function syncTableChanged({ dispatch },tables){
    dispatch('restartEventSource');
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

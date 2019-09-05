import {SSE} from "nativescript-sse";

let eventSource = null;

export function restartEventSource({ dispatch }){
    clearEventSource(); dispatch('startEventSource');
}

export function startEventSource({ dispatch,getters }){
    let url = getPreparedSSEUrl(getters.SSEUrl,getters.SYNCTables);
    if(url) return dispatch('processEventSource',url);
}

export function processEventSource({dispatch}, url) {
    eventSource = new SSE(url);
    eventSource.events.on('onMessage', (data) => {
        let tables = purifySSEDataMessage(data);
        dispatch('triggerEventSubscribers',{ event:'SSEMonitor',payload:tables },{ root:true });
    });
    eventSource.events.on('onError', (data) => {
        setTimeout(function (dispatch) { dispatch('restartEventSource') },3000,dispatch)
    });
}

export function onConnectionChange({ dispatch },status){
    clearEventSource();
    if(status) return dispatch('startEventSource');
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

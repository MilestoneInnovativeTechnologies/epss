import axios from 'axios';

import {
    add_configuration_to_server_queue,
    start_process_queue,
    initiate_processing_transfer,
    finalize_processing_transfer, finalize_failed_transfer,
} from './../../mutation-types'
import {maximum_processing_seconds} from "../../../constants";

const queueCheckSeconds = 5; let timeOutVariable = 0;
const timer = require('@nativescript/core/timer');

export function init({ commit,dispatch }) {
    dispatch('processQueue');
}

export function queue({ dispatch,commit },{ config,success,fail }) {
    if(_.isEmpty(config.url) && _.isEmpty(config.request.url)) return;
    commit(add_configuration_to_server_queue, { config,success,fail });
    dispatch('processQueue');
}

export const get = {
    root:true,
    handler({ dispatch },{ url,params,success,fail }) {
        let config = { url,params,method:'get' };
        dispatch('queue',{ config,success,fail });
    }
};

export const post = {
    root:true,
    handler({ dispatch },{ url,params,success,fail }) {
        let config = { url,data:params,method:'post' };
        dispatch('queue',{ config,success,fail });
    }
};

export function processQueue({ state:{ transfer,processing },getters:{ queue_count,connection },dispatch }) {
    if(connection && !transfer && queue_count > 0 && _.isEmpty(processing)) return dispatch('initProcessQueue');
    if(queue_count > 0) {
        timer.clearTimeout(timeOutVariable);
        timeOutVariable = timer.setTimeout(dispatch, queueCheckSeconds * 1000, 'processQueue');
        dispatch('checkForFailedProcessing')
    }

}

export function initProcessQueue({ commit,dispatch,getters }) {
    commit(start_process_queue);
    dispatch('proceedProcessing')
}

export function proceedProcessing({ commit,dispatch }) {
    commit(initiate_processing_transfer);
    // return dispatch('doHTTPRequest');
    return dispatch('doAxiosRequest');
}

export function doAxiosRequest({ state,dispatch }) {
    axios.request(state.processing).then((response) => {
        dispatch('doHandleRequestResponse',response);
    }).catch(() => dispatch('doHandleFailedResponse'))
}

export function doHTTPRequest({ state:{ processing },dispatch }) {
    let content = _.map(processing.params,(val,key) => [key,val].join('=')).join('&');
    if(processing.method === 'get'){
        let url = processing.url + '?' + content
        http.request({ url,method:'get' }).then(resp => dispatch('doHandleRequestResponse',{ data:resp.content.toJSON() }),err => dispatch('doHandleFailedResponse'))
    } else {
        let url = processing.url, content = _.map(processing.data,(val,key) => [key,val].join('=')).join('&');
        http.request({ url,content,method:'post' }).then(resp => dispatch('doHandleRequestResponse',{ data:resp.content.toJSON() }),err => dispatch('doHandleFailedResponse'))
    }
}

export function doHandleRequestResponse({ state,dispatch,commit,getters }, response) {
    state.last_response = response;
    if(!_.isEmpty(state.success)) dispatch(state.success,response.data,{ root: true });
    commit(finalize_processing_transfer);
    timer.setTimeout(function(dispatch){ dispatch('processQueue'); },queueCheckSeconds * 1000,dispatch);
}

export function doHandleFailedResponse({ state,getters,dispatch,commit }) {
    if(!_.isEmpty(state.fail)) dispatch(state.fail,null,{ root: true });
    commit(finalize_failed_transfer);
    timer.setTimeout(function(dispatch){ dispatch('processQueue'); },queueCheckSeconds * 1000,dispatch);
}

export function checkForFailedProcessing({ state,dispatch }) {
    if((__.now() - _.toSafeInteger(state.process_time)) > maximum_processing_seconds)
        return dispatch('doHandleFailedResponse')
}

export const api = {
    root: true,
    handler({ state,getters,dispatch },{ item,params,success }){
        let config = _.isEmpty(params) ? getters.api_config : _.defaultsDeep({ data:params },getters.api_config);
        config.url = getters.url_api(item);
        axios.request(config).then((response) => {
            if(_.isFunction(success)) return success.call(response,response.data);
            if(!_.isEmpty(success)) dispatch(success,response.data,{ root: true });
        });
    }
};

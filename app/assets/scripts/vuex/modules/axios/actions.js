import axios from 'axios';
// const connectivity = require("tns-core-modules/connectivity");
import { getConnectionType,connectionType,startMonitoring } from "tns-core-modules/connectivity";

import {
    add_configuration_to_server_queue,
    start_process_queue,
    initiate_processing_transfer,
    finalize_processing_transfer, finalize_failed_transfer, set_connectivity_availability,
} from './../../mutation-types'

const queueCheckSeconds = 5; let timeOutVariable = 0;

export function init({ dispatch }) {
    // startMonitoring((type) => { commit(set_connectivity_availability,type !== connectionType.none) });
    dispatch('processQueue');
}

export function queue({ dispatch,commit },{ config,success }) {
    commit(add_configuration_to_server_queue, { config,success });
    dispatch('processQueue');
}

export function get({ dispatch },{ url,params,success }) {
    let config = { url,params,method:'get' };
    dispatch('queue',{ config,success });
    log('Queued get, '+url);
}

export function post({ dispatch },{ url,params,success }) {
    let config = { url,params,method:'post' };
    dispatch('queue',{ config,success });
    log('Queued post, '+url);
}

export function processQueue({ state,getters,dispatch }) {
    if(state.connection && !state.transfer && getters.queue_count > 0 && _.isEmpty(state.processing))
        return dispatch('initProcessQueue');
    if(getters.queue_count > 0) {
        clearTimeout(timeOutVariable);
        timeOutVariable = setTimeout(function (dispatch) {
            log('Request queue recheck, ' + new Date().getTime());
            dispatch('processQueue')
        }, queueCheckSeconds * 1000, dispatch);
    }

}

export function initProcessQueue({ commit,dispatch,state }) {
    commit(start_process_queue);
    log('Processing queue, ' + state.processing.url);
    dispatch('proceedProcessing')
}

export function proceedProcessing({ commit,dispatch,state }) {
    commit(initiate_processing_transfer);
    log('Requesting.., ' + state.processing.url);
    axios.request(state.processing).then((response) => {
        log('Response..., ' + state.processing.url); state.last_response = response;
        if(!_.isEmpty(state.success)) dispatch(state.success,response.data,{ root: true });
        commit(finalize_processing_transfer);
        setTimeout(function(dispatch){ dispatch('processQueue'); },queueCheckSeconds,dispatch);
    }).catch(() => {
        log('Failed.., ' + state.processing.url);
        commit(finalize_failed_transfer);
        setTimeout(function(dispatch){ dispatch('processQueue'); },queueCheckSeconds,dispatch);
    })
}

export const api = {
    root: true,
    handler({ state,getters,dispatch },{ item,params,success }){
        params = _.isEmpty(params) ? state.api_config : _.defaultsDeep(params,state.api_config);
        let url = getters.url_api(item);
        axios.post(url,params).then((response) => {
            if (_.isFunction(success)) return success.call(response,response.data);
            if(!_.isEmpty(success)) dispatch(success,response.data,{ root: true });
        });
    }
};

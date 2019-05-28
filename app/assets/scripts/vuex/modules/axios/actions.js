import axios from 'axios';
//const connectivity = require("tns-core-modules/connectivity");
import { getConnectionType,connectionType,startMonitoring } from "tns-core-modules/connectivity";

import {
    add_configuration_to_server_queue,
    start_process_queue,
    initiate_processing_transfer,
    finalize_processing_transfer, finalize_failed_transfer, set_connectivity_availability,
} from './../../mutation-types'

const queueCheckSeconds = 3000; let timeOutVar = 0;

export function init({ commit }) {
    startMonitoring((type) => {
        console.log(type);
        commit(set_connectivity_availability,type !== connectionType.none)
    });
}

export function get({ dispatch,commit,state },{ url,params,success }) {
    let config = { url,params,method:'get' };
    commit(add_configuration_to_server_queue, { config,success });
    log('Queued Request'); dispatch('processQueue')
}

export function post({ dispatch,commit,state },{ url,params,success }) {
    let config = { url,params,method:'post' };
    commit(add_configuration_to_server_queue, { config,success });
    log('Queued Request'); dispatch('processQueue')
}

export function processQueue({ state,getters,dispatch }) {
    if(!state.connection)  return setTimeout(function(dispatch){ log('Rechecking: '+new Date().getTime()); dispatch('processQueue') },queueCheckSeconds,dispatch);
    if(state.transfer || getters.queue_count === 0 || !_.isEmpty(state.processing)) return;
    log('Initializing process queue..');
    dispatch('initProcessQueue');
}

export function initProcessQueue({ commit,dispatch }) {
    commit(start_process_queue);
    log('Processing queue item..');
    dispatch('proceedProcessing')
}

export function proceedProcessing({ commit,dispatch,state }) {
    commit(initiate_processing_transfer);
    log('Sending request..'); console.log(_.cloneDeep(state.processing));
    axios.request(state.processing).then((response) => {
        log('Response received'); state.last_response = response;
        if(!_.isEmpty(state.success)) return dispatch(state.success,response.data,{ root: true }).then(() => {
            log('Finishing request'); commit(finalize_processing_transfer);
            setTimeout(function(dispatch){ dispatch('processQueue'); },queueCheckSeconds,dispatch);
        });
        log('Finishing request'); commit(finalize_processing_transfer);
        dispatch('processQueue');
    }).catch((e) => {
        log('Request failed!!',e);
        commit(finalize_failed_transfer);
        setTimeout(function(dispatch){ dispatch('processQueue'); },queueCheckSeconds,dispatch);
    })
}

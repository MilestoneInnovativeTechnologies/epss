import axios from 'axios';
const backHttp = require("nativescript-background-http");
const session = backHttp.session("activity-upload");
const { File } = require('tns-core-modules/file-system');

import { connectionType,startMonitoring } from "tns-core-modules/connectivity";

import {
    add_configuration_to_server_queue,
    start_process_queue,
    initiate_processing_transfer,
    finalize_processing_transfer, finalize_failed_transfer, set_connectivity_availability,
} from './../../mutation-types'
import {maximum_processing_seconds} from "../../../constants";

const queueCheckSeconds = 5; let timeOutVariable = 0;

export function init({ commit,dispatch }) {
    startMonitoring((type) => { commit(set_connectivity_availability,type !== connectionType.none) });
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
        log('Queued get, '+url);
    }
};

export const post = {
    root:true,
    handler({ dispatch },{ url,params,success,fail }) {
        let config = { url,data:params,method:'post' };
        dispatch('queue',{ config,success,fail });
        log('Queued post, '+url);
    }
};

export const file = {
    root:true,
    handler({ dispatch },{ url,params,success,fail }) {
        let config = { params, request:FD.request(url) };
        dispatch('queue',{ config,success,fail });
        log('Queued post, '+url);
    }
};

export function processQueue({ state,getters,dispatch }) {
    if(state.connection && !state.transfer && getters.queue_count > 0 && _.isEmpty(state.processing))
        return dispatch('initProcessQueue');
    if(getters.queue_count > 0) {
        clearTimeout(timeOutVariable);
        timeOutVariable = setTimeout(function (dispatch) {
            log('Request queue recheck, ' + new Date().getTime());
            dispatch('processQueue')
        }, queueCheckSeconds * 1000, dispatch);
        dispatch('checkForFailedProcessing')
    }

}

export function initProcessQueue({ commit,dispatch,getters }) {
    commit(start_process_queue);
    log('Processing queue, ' + getters.processing_url);
    dispatch('proceedProcessing')
}

export function proceedProcessing({ commit,dispatch,getters }) {
    commit(initiate_processing_transfer);
    return getters.isFile ? dispatch('doBackHttpRequest') : dispatch('doAxiosRequest');
}

export function doAxiosRequest({ state,dispatch }) {
    log('Requesting.., ' + state.processing.url);
    axios.request(state.processing).then((response) => {
        dispatch('doHandleRequestResponse',response);
    }).catch(() => dispatch('doHandleFailedResponse'))
}

export function doBackHttpRequest({ state,dispatch }) {
    let processing = _.cloneDeep(state.processing);
    try {
        let task = session.multipartUpload(processing.params,processing.request);
        task.on("responded", function(e){
            let response = { data: _.isEmpty(_.trim(e.data.replace(/\0/g,''))) ? [] : JSON.parse(e.data), responseCode:e.responseCode, task:e.task };
            dispatch('doHandleRequestResponse',response);
        });
        task.on("error", function (e) {
            dispatch('doHandleFailedResponse')
        })
    } catch (e) {
        log('Upload Failed, Trying posting data');
        postDataUsingBase64(processing)
            .then((response) => dispatch('doHandleRequestResponse',response))
            .catch(() => dispatch('doHandleFailedResponse'));
    }
}

export function doHandleRequestResponse({ state,dispatch,commit,getters }, response) {
    log('Response..., ' + getters.processing_url); state.last_response = response;
    if(!_.isEmpty(state.success)) dispatch(state.success,response.data,{ root: true });
    commit(finalize_processing_transfer);
    setTimeout(function(dispatch){ dispatch('processQueue'); },queueCheckSeconds * 1000,dispatch);
}

export function doHandleFailedResponse({ state,getters,dispatch,commit }) {
    log('Failed.., ' + (getters.processing_url));
    if(!_.isEmpty(state.fail)) dispatch(state.fail,null,{ root: true });
    commit(finalize_failed_transfer);
    setTimeout(function(dispatch){ dispatch('processQueue'); },queueCheckSeconds * 1000,dispatch);
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

function postDataUsingBase64({ params,request }){
    let url = request.url, data = {};
    _.forEach(params,({ name,value,filename }) => data[name === 'file' ? 'content' : name] = (name === 'file') ? filename : value );
    return new Promise(function (resolve, reject) {
        getBase64ContentFromFilePath(data.content).then((content) => {
            data['content'] = content;
            axios.post(url,data)
                .then(response => resolve(response))
                .catch(e => reject(e));
        })
    })
}

function getBase64ContentFromFilePath(path) {
    return new Promise(((resolve, reject) => {
        if(!File.exists(path)) return resolve('');
        File.fromPath(path).readText().then(data => {
            resolve(base64Encode(data).replace(/\r?\n|\r/g,''))
        });
    }))
}

function base64Encode(value) {
    let text = new java.lang.String(value);
    let data = text.getBytes("UTF-8");
    return android.util.Base64.encodeToString(data, android.util.Base64.DEFAULT);
}
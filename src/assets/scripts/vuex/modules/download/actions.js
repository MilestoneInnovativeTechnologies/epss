import {clear_download_log_delay,maximum_download_tries} from "../../../constants";

const fsm = require('@nativescript/core/file-system');
const download_common_params = { format:'json',type:'file' };
const app_user_create_date = '1900-01-01 00:00:01';
const timer = require('@nativescript/core/timer');

let timeOut = 0;
const tableID = {};
let DownloadBatchItem,DownloadSuccess,DownloadFailed,ProcessDownloadedData;

export function init(ctx){
    DownloadBatchItem = _.bind(downloadBatchItem,ctx);
    DownloadSuccess = _.bind(downloaded,ctx);
    DownloadFailed = _.bind(download_fails,ctx);
    ProcessDownloadedData = _.bind(doProcessDownloadedData,ctx);
    timer.setTimeout(() => clearDownloadLog(),clear_download_log_delay * 1000);
}

export function tables({ dispatch },tables){
    if(!Array.isArray(tables) || tables.length === 0) return null;
    dispatch('batch',tables).then(() => dispatch('processBatch'));
}

export function batch({ state,commit },tables){
    tables.forEach(table => state.batch.running.includes(table) ? null : commit('addToBatch',table));
    return state.batch;
}

export function processBatch({ state,commit,dispatch,rootState }){
    if(state.processing || !rootState['Connection'].status) { timer.clearTimeout(timeOut); return timeOut = timer.setTimeout(() => dispatch('processBatch'),5000) }
    if(state.batch.next.length){
        commit('start'); dispatch('triggerEventSubscribers',{ event:state.subscribeEvents[0],payload:state.batch.running },{ root:true });
        state.batch.running.forEach(table => dispatch('table',table));
        timer.setTimeout(() => dispatch('start'),2000)
    }
}

export function table({ rootState,rootGetters },table){
    let { type,direction } = rootState['Sync'].tables[table];
    if(direction === 'upload') return;
    let downloadData = getDownloadData(table,type,rootGetters);
    _.set(tableID,table,downloadData);
}

export function start(ctx) {
    if(ctx.state.batch.running.length){
        DownloadBatchItem(_.clone(ctx.state.batch.running),0,0);
    }
}

export function SSEMonitor({ dispatch },tables) {
    tables = Array.isArray(tables) ? tables : [tables]; if(tables.length === 0) return null;
    dispatch('tables',tables);
}

function getDownloadData(table,type,rootGetters){
    let url = getURL(table,rootGetters);
    // let method = 'get';
    let query = getQuery(type,rootGetters.user,rootGetters.client);
    // let content = JSON.stringify(query);
    let path = getPath();
    let fileName = getName(table);
    let filePath = getFilePath(path,fileName);
    let urlParams = getUrlParams(url,query);
    return { filePath,urlParams }
}

function getQuery(type,_user,client){
    let params = download_common_params;
    if(type !== 'APP') params = _.assign({},params,{ _user,client });
    if(type === 'APPUSER') params = _.assign({},params,{ created:app_user_create_date });
    return params;
}

function getURL(table,rGetters){
    return rGetters['Sync/tableSyncUrl'](table)
}

function getPath(){
    return fsm.knownFolders.temp().getFolder('tblDwn').path;
}

function getName(table){
    return [table,'json'].join('.');
}

function getFilePath(path,file){
    return fsm.path.join(path,file);
}

function getUrlParams(url,query){
    return encodeURI(url + '?' + _.map(query,(v,k) => [k,v].join('=')).join('&'))
}

function downloadBatchItem(batch,idx,times){
    if(idx >= batch.length || !batch[idx]) return;
    let table = batch[idx], downloadData = tableID[table]; if(!downloadData) return;
    let { filePath,urlParams } = downloadData;
    if(times === undefined) times = 0;
    http.getFile(urlParams,filePath)
        .then(result => {
            DownloadSuccess(table, downloadData, result);
            timer.setTimeout(DownloadBatchItem, 500, batch, parseInt(idx) + 1, 0)
        },error => {
            if(times < maximum_download_tries) return timer.setTimeout(DownloadBatchItem,3000,batch,idx,times+1)
            else {
                DownloadFailed(table,downloadData, { status:error.statusCode,message:'' })
                timer.setTimeout(DownloadBatchItem,500,batch,parseInt(idx)+1,0)
            }
        })
}
function downloaded(table, { filePath,fileName },File){
    this.dispatch('triggerEventSubscribers',{ event:this.state.subscribeEvents[1],payload:table },{ root:true });
    File.readText()
        .then(activities => ProcessDownloadedData(table,filePath,activities))
        .catch(error => log('File read failed for table: '+table,error))
}
function download_fails(table,task,{ status,message }){
    log('Download: Failed downloading for table '+ table);
    this.dispatch('tables',[table]);
    this.commit('complete',{ table,status,message,records:0 })
}
function doProcessDownloadedData(table,path,data){
    let jData = getJSONData(data,path);
    if(jData.length) this.dispatch('Sync/doProcessSyncData',jData,{ root:true });
    fsm.File.fromPath(path).remove().then(null);
    this.commit('complete',{ table,status:'success',message:'success',records:jData.length ? jData[0].data.length : 0 })
}
function getJSONData(data,path){
    let jData = [];
    if(data && data.trim() !== '' && data.trim().substr(0,1) === '[') {
        try {
            jData = JSON.parse(data.trim());
        } catch (e){
            log('Error in parsing activities from path: ' + path, e);
        }
    }
    return jData;
}
function clearDownloadLog() {
    DB.delete('epss_download',[{ updated_at:__.now()-3600,operator:'<' }],function(){
        if(this.error) log('Clearing download logs failed');
        timer.setTimeout(() => clearDownloadLog(),clear_download_log_delay*1000);
    });
}

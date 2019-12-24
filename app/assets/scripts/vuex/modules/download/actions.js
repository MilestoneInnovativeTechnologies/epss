const fsm = require('tns-core-modules/file-system');
const download_common_params = { format:'json',type:'file' };
const app_user_create_date = '1900-01-01 00:00:01';

let timeOut = 0;
const tableID = {};
let DownloadSuccess,DownloadFailed,ProcessDownloadedData;

export function init(ctx){
    DownloadSuccess = _.bind(downloaded,ctx);
    DownloadFailed = _.bind(download_fails,ctx);
    ProcessDownloadedData = _.bind(doProcessDownloadedData,ctx);
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
    if(state.processing || !rootState['Connection'].status) { clearTimeout(timeOut); return timeOut = setTimeout(() => dispatch('processBatch'),5000) }
    if(state.batch.next.length){
        commit('start'); dispatch('triggerEventSubscribers',{ event:state.subscribeEvents[0],payload:state.batch.running },{ root:true });
        state.batch.running.forEach(table => dispatch('table',table));
        setTimeout(() => dispatch('start'),2000)
    }
}

export function table({ rootState,rootGetters },table){
    let { type,direction } = rootState['Sync'].tables[table];
    if(direction === 'upload') return;
    let downloadData = getDownloadData(table,type,rootGetters);
    _.set(tableID,table,Downloader.createDownload(downloadData));
}

export function start(ctx) {
    _.forEach(ctx.state.batch.running,(table,idx) => {
        let taskID = tableID[table]; if(!taskID) return;
        setTimeout(function (table, taskID) {
            return Downloader.start(taskID)
                .then(completed => DownloadSuccess(table,taskID,completed))
                .catch(error => DownloadFailed(table,taskID,error));
        },idx*3000,table,taskID);
    })
}

export function SSEMonitor({ dispatch },tables) {
    tables = Array.isArray(tables) ? tables : [tables]; if(tables.length === 0) return null;
    dispatch('tables',tables);
}

function getDownloadData(table,type,rootGetters){
    let query = getQuery(type,rootGetters.user,rootGetters.client);
    let url = getURL(table,rootGetters);
    let path = getPath();
    let fileName = getName(table);
    return { url,query,path,fileName }
}

function getQuery(type,_user,client){
    let params = download_common_params;
    if(type !== 'APP') params = _.assign({},params,{ _user,client });
    if(type === 'APPUSER') params = _.assign({},params,{ created:app_user_create_date });
    return params;
}

function getURL(table,rGetters){
    return rGetters['Sync/tableSyncUrl'](table) + '?'
}

function getPath(){
    return fsm.knownFolders.temp().getFolder('tblDwn').path;
}

function getName(table){
    return [table,'json'].join('.');
}

function downloaded(table,task,{ path }){
    this.dispatch('triggerEventSubscribers',{ event:this.state.subscribeEvents[1],payload:table },{ root:true });
    fsm.File.fromPath(path).readText()
        .then(activities => { ProcessDownloadedData(path,activities); this.commit('complete',table); })
        .catch(error => log('File read failed for table: '+table,error))
}
function download_fails(table,task,{ status,message }){
    log('Download: Failed downloading for table '+ table);
    this.dispatch('tables',[table]);
    this.commit('complete',table)
}
function doProcessDownloadedData(path,data){
    if(data && data.trim() !== ''){
        data = data.trim();
        try {
            if(data.substr(0,1) === '[') this.dispatch('Sync/doProcessSyncData',JSON.parse(data.trim()),{ root:true });
            fsm.File.fromPath(path).remove().then(null);
        } catch (e) {
            log('Error in parsing activities from path: ' + path);
        }
    }
}
const fsm = require('tns-core-modules/file-system');
const download_common_params = { format:'json',type:'file' };
const app_user_create_date = '1900-01-01 00:00:01';

let timeOut = 0;
const tableID = {};

export function tables({ dispatch },tables){
    console.error('Called action Download/tables with tables: ',tables);
    if(!Array.isArray(tables) || tables.length === 0) return null;
    dispatch('batch',tables).then(() => dispatch('processBatch'));
}

export function batch({ state,commit },tables){
    console.error('Called action Download/batch with tables: ',tables);
    tables.forEach(table => state.batch.running.includes(table) ? null : commit('addToBatch',table));
    return state.batch;
}

export function processBatch({ state,commit,dispatch }){
    console.error('Called action Download/processBatch');
    if(state.processing) { clearTimeout(timeOut); return timeOut = setTimeout(() => dispatch('processBatch'),5000) }
    if(state.batch.next.length){
        commit('start'); dispatch('triggerEventSubscribers',{ event:state.subscribeEvents[0],payload:state.batch.running },{ root:true });
        state.batch.running.forEach(table => dispatch('table',table));
        setTimeout(() => dispatch('start'),2000)
    }
}

export function table({ rootState,rootGetters },table){
    console.error('Called action Download/table with table: ',table);
    console.error('Table Properties: ',rootState['Sync'].tables[table]);
    let { type,direction } = rootState['Sync'].tables[table];
    console.error('Type and Direction of table: '+table+' is ' + type + ', ' + direction);
    if(direction === 'upload') return console.error('Direction of table: '+table+' is ' + direction + 'Cant go further');
    let downloadData = getDownloadData(table,type,rootGetters);
    console.warn('Prepared download data for table: '+table+', is:',downloadData);
    _.set(tableID,table,Downloader.createDownload(downloadData));
    console.error('Set download task id for table: '+table+', and task id:'+tableID[table]);
}

export function start(ctx) {
    console.error('In Dispatch DOWNLOAD/START.. Batch is:',ctx.state.batch,' and tableID: ',tableID);
    _.forEach(ctx.state.batch.running,(table,idx) => {
        let taskID = tableID[table]; if(!taskID) return;
        let success = _.bind(downloaded,ctx,table,taskID), fail = _.bind(download_fails,ctx,table,taskID);
        setTimeout(function (taskID, success, fail) {
            return Downloader.start(taskID).then(completed => success(completed)).catch(error => fail(error));
        },idx*3000,taskID,success,fail);
    })
}

export function SSEMonitor({ dispatch },tables) {
    console.error('Called action Download/SSEMonitor with tables: ',tables);
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
    console.error('Download succeeded for table: '+table+'... File saved to path: ' + path);
    fsm.File.fromPath(path).readText()
        .then(activities => {
            console.error('File read succeeded for table: '+table);
            if(activities && activities.trim() !== ''){
                try {
                    let Activities = JSON.parse(activities);
                    this.dispatch('Sync/doProcessSyncData',Activities,{ root:true });
                    fsm.File.fromPath(path).remove().then(null);
                    console.error('Removed file from path ' + path);
                } catch (e) {
                    console.error('Error in parsing activities of table: ' + table + '.. Path: ' + path);
                }
            }
            this.commit('complete',table);
        })
        .catch(error => console.error('File read failed for table: '+table,error))
}
function download_fails(table,task,{ status,message }){
    console.error('Download fails for table: '+table+'... Server response: ' + status +'.. Response Message: ' + message);
    this.dispatch('tables',[table]);
    this.commit('complete',table)
}
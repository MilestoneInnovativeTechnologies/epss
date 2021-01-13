export default {
    dbTables:['epss_app','epss_user'],
    appTables:['epss_sync','epss_download'],
    dbFields:['name,detail','name,detail','url,uuid,user,content,onsuccess,onfail,progress,added,considered,responded,response,status','table,status,message,records'],
    dbIndexes:['name','name','progress,status','table'],
    dbSLog:['Create app table','Create user table','Create sync table','Create download table'],
    tasks: ['Init state data', 'Request device registration data', 'Create app table', 'Create user table', 'Create sync table', 'Create download table', 'Insert device registration data', 'Initialize app', 'Reset client on server', 'Get DB tables', 'Create DB tables', 'Init synchronizing app records', 'Completed!'],
    cTasks: [],
    downloadableTables: [],
    downloadedTables: [],
    message: '', uuid: '', height: '', width:'',
    code: '', name: null, image: null, brief: null,
    url_web:null, url_api:null, url_interact:null,
}

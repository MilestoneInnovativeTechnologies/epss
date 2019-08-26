export default {
    dbTables:['epss_app','epss_user','epss_sync'],
    dbFields:['name,detail','name,detail','url,params,content,onsuccess,onfail,progress,added,considered,responded,response,status'],
    dbSLog:['Create app table','Create user table','Create sync table'],
    tasks: { 'Init state data':false, 'Request device registration data':false,
        'Create app table':false, 'Create user table':false, 'Create sync table':false,
        'Insert device registration data':false,'Initialize app':false,
        'Reset client on server':false, 'Get DB tables':false,'Create DB tables':false,'Init synchronizing app records':false,'Completed!':false },
    message: '', uuid: '', height: '', width:'',
    code: '', name: null, image: null, brief: null,
    print_head_line1: null, print_head_line2: null, footer_text: null,
    url_web:null, url_api:null, url_interact:null,
}

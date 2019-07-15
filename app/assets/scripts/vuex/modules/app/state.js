export default {
    dbTables:['app','user'], fields:'name,detail',
    tasks: { 'Init state data':false, 'Request device registration data':false, 'Create app table':false,
        'Insert device registration data':false,'Initialize app':false, 'Create user table':false,
        'Reset client on server':false, 'Get DB tables':false,'Create and sync tables':false },
    message: '', uuid: '', height: '', width:'',
    code: '', name: null, image: null, brief: null,
    print_head_line1: null, print_head_line2: null, footer_text: null,
    url_web:null, url_api:null, url_interact:null,
}

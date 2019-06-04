export default {
    connection: true,
    queue: [],
    processing: {},
    status: '',
    transfer: false,
    config: { responseType:'json' },
    url_interact: '',
    url_api: '',
    url_sync: '',
    success: '',
    sync_config: { url:'',method:'post' },
    api_config: { method:'post',params:{ _user:'',token:'' } },
    last_response: { },
    queue_failed: [ ],
    client: ''
}

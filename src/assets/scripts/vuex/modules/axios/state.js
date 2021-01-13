export default {
    queue: [],
    processing: {},
    process_time: 0,
    status: '',
    transfer: false,
    config: { responseType:'json' },
    url_interact: '',
    url_api: '',
    url_sync: '',
    success: '',
    fail: '',
    sync_config: { url:'',method:'post' },
    api_config: { method:'post',params:{ token:'' },data:{ _user:'' } },
    last_response: { },
    queue_failed: [ ],
    client: ''
}

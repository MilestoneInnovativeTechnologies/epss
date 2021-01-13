export default {
    enums: { ADDED:0,CONSIDERED:1,RESPONDED:2,NEW:0,PROCESSING:1,SUCCESS:2,FAILED:4,RETRY:3 },
    processing: null,
    init_time: 0,
    latest: 0,
    completed: 0,
    retry_count: 0,
    subscribeEvents: ['activityUpload'],
    uData: {},
    reset: [],
}

export default {
    dbTables:['user','user_store_area'],
    id: null,
    name: null,
    login: null,
    password: '',
    pLogin: null,

    pin: null,
    time_out: null,
    api_token: null,
    reference: null,
    message: null,
    validating: false,

    sync: {
        downloadableTables: [],
        downloadedTables: [],
    }
}

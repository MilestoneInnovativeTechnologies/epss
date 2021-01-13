import { set_user_pin } from '../../mutation-types';

export default {
    [set_user_pin](state, data) { state.pin = data; },
    initSync(state){
        state.sync.downloadableTables.splice(0,state.sync.downloadableTables.length+1)
        state.sync.downloadedTables.splice(0,state.sync.downloadedTables.length+1)
    },
    downloadable(state,tables){
        if(!tables) return; tables = Array.isArray(tables) ? tables : [tables];
        tables.forEach(table => _.has(state.sync.downloadableTables,table) ? null : state.sync.downloadableTables.push(table))
    },
    downloaded(state,table){
        if(!table) return;
        if(!_.has(state.sync.downloadedTable,table)) state.sync.downloadedTables.push(table)
    }
};



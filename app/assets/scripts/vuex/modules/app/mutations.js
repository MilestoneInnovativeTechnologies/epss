export default {
    dwnTables(state,tables){
        if(!tables || !Array.isArray(tables) || tables.length === 0) return;
        state.dwnTables = Object.assign({},state.dwnTables,_.zipObject(tables,Array(tables.length).fill(false)))
    },
    downloadedTable(state,table){
        state['dwnTables'][table] = true;
    }
}
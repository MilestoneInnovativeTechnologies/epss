export default {
    dwnTables(state,tables){
        if(!tables || !Array.isArray(tables) || tables.length === 0) return;
        state.dwnTables = Object.assign({},state.dwnTables,_.zipObject(tables,Array(tables.length).fill(false)))
        state.downloadableTables = tables;
    },
    downloadedTable(state,table){
        state['dwnTables'][table] = true;
        state.downloadedTables.push(table);
    },
    taskCompleted(state,task){ state.cTasks.push(task) }
}
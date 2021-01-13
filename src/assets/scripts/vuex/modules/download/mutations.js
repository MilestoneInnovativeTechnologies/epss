export default {
    addToBatch(state,table){
        if(!state.batch.running.concat(state.batch.next).includes(table))
            state.batch.next.push(table)
    },
    start(state){
        state.batch.running.push(...(state.batch.next));
        state.batch.next = [];
        state.processing = !!state.batch.running.length
    },
    complete(state,data){
        let table = data.table;
        if(state.batch.running.includes(table))
            state.batch.running.splice(state.batch.running.indexOf(table),1);
        state.processing = !!state.batch.running.length;
        DB.insert('epss_download',data);
    },
}
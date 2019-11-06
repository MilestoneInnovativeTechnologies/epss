export default {
    addToBatch(state,table){
        console.error('Called mutation Download/addToBatch with table: ',table);
        if(!state.batch.running.concat(state.batch.next).includes(table))
            state.batch.next.push(table)
    },
    start(state){
        console.error('Called mutation Download/start having batch:',state.batch);
        state.batch.running.push(...(state.batch.next));
        state.batch.next = [];
        state.processing = !!state.batch.running.length
    },
    complete(state,table){
        console.error('Called action Download/complete of table: ',table);
        if(state.batch.running.includes(table))
            state.batch.running.splice(state.batch.running.indexOf(table),1);
        state.processing = !!state.batch.running.length;
    },
}
export function haveQueue({ queue_index }){ return queue_index.length !== 0 }
export function haveQueueEarlierThan({ queue_index }){ return (time) => time >= _.head(queue_index); }
export function canStartProcessingQueue({ processing }){ return _.isEmpty(processing); }
export function getFirstQueueItem({ queue_index,queue }){
    let index = _.head(queue_index), item = queue[index];
    return { item,index };
}
export function getTableSyncUrl({ url }){ return (table) => url + table; }
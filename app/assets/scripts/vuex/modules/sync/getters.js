export function haveQueue({ queue_index }){ return queue_index.length !== 0 }
export function haveQueueEarlierThan({ queue_index }){ return (time) => time >= _.head(queue_index); }
export function canStartProcessingQueue({ processing },getters,rootState){ return (_.isEmpty(processing) && !!rootState['App'].uuid && rootState['Axios'].connection); }
export function getFirstQueueItem({ queue_index,queue }){
    let index = _.head(queue_index), item = queue[index];
    return { item,index };
}
export function syncBaseUrl(state,getters,rootState){ let app = rootState['App']; return [app.url_interact,'sync',app.uuid,''].join('/') }
export function tableSyncUrl(state,{ syncBaseUrl }){ return (table) => syncBaseUrl + table; }
export function deleteClientUrl(state,getters,rootState){ let app = rootState['App']; return [app.url_interact,'sync','delete'].join('/') }

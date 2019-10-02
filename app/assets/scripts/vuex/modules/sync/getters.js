export function syncBaseUrl(state,getters,rootState){ let app = rootState['App']; return [app.url_interact,'sync',app.uuid,''].join('/') }
export function tableSyncUrl(state,{ syncBaseUrl }){ return (table) => syncBaseUrl + table; }
export function deleteClientUrl(state,getters,rootState){ let app = rootState['App']; return [app.url_interact,'sync','delete'].join('/') }

export function table(state,getters,rootState) { return rootState['App'].appTables[0]; }
export function tables(state,getters,rootState){ return rootState['Sync'].tables; }
export function url(state,getters,rootState,rootGetters){
    let app = rootState['App'];
    if(!app.url_interact || !app.uuid) return null;
    return (table) => [app.url_interact,'sync',app.uuid,table].join('/');
}

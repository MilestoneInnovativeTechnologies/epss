import {
    mutate_sync_data,
    update_table_timing,
    add_module,
    bind_table_module,
    create_event_subscription,
    add_event_subscriber,
} from "./mutation-types";

export function init({ dispatch,commit },modulesMap){
    let initActions = [];
    _.forEach(modulesMap, ({ _rawModule }, Module) => {
        let module = _.trim(Module, '/'); commit(add_module, module);
        if (_.has(_rawModule.actions,'init')) initActions.push(Module+'init');
        if (_rawModule.state.dbTables) commit(bind_table_module, { table: _rawModule.state.dbTables,  module });
        if (_rawModule.state.subscribeEvents && _rawModule.state.subscribeEvents.length) {
            _rawModule.state.subscribeEvents.forEach(sEvent => commit(create_event_subscription, {event: sEvent}))
        }
    });
    dispatch('addEventSubscribers',modulesMap).then(() => initActions.forEach(action => dispatch(action)) );
    dispatch('initRedrawData');
}

export function redrawModules({state, commit, dispatch}, table) {
    if (!_.has(state.table_modules, table)) return;
    _.forEach(state.table_modules[table], (module) => {
        let query = (state[module]['dbQuery'] && state[module]['dbQuery'][table]) ? state[module]['dbQuery'][table] : `SELECT * FROM ${table}`;
        let { action,type } = (_.has(state[module],'cacheTables') && _.includes(state[module]['cacheTables'],table))
            ? { action:dispatch,type:'cacheTableData' }
            : { action:commit,type:module + '/' + mutate_sync_data };
        redrawTableData(table,query,action,type);
    });
}

function redrawTableData(table,query,action,type) {
    DB.table(table).getAllQuery(query, function (action, type) {
        if(this.error) return log('REDRAW Query Error for table: '+this.table(),this.error);
        action(type, { table:this.table(),data:this.result }, {root: true});
    }, [action,type]);
}

export function cacheTableData(context, {table,data}) {
    data = (Array.isArray(data) && data.length > 0) ? data : [];
    CCache[table] = new DBCache(table,data);
}

export function initRedrawData({state,dispatch}) {
    DB.get(state['App'].dbTables[0],1,function(tblModules,dispatch){
        if(!this.error) _.forEach(tblModules,(modules,table) => dispatch('redrawModules',table));
    },state.table_modules,dispatch)
}

export function _insert({ dispatch },{ table,data,success,vm,upload }){
    return new Promise((resolve) => {
        let records = Array.isArray(data) ? data : [data], totalRecords = records.length; upload = (upload === undefined) ? true : upload;
        DB.insert(table,records,function (totalRecords,table,resolve,callback,vm,actUpload) {
            let lastID = this.result, id = _.range(_.toSafeInteger(lastID),lastID-totalRecords); DB.get(table,id,function(resolve,table,dispatch,actUpload){
                let activity = getActivity(table,this.result,'create');
                resolve(activity); if(actUpload) dispatch('triggerEventSubscribers',{ event:'activityUpload',payload:activity });
            },resolve,table,dispatch,actUpload);
            dispatch('postDBAction',{ table,type:'create' });
            if(callback) if(_.isFunction(callback)) callback.call(vm,id); else vm[callback].call(vm,id);
        },totalRecords,table,resolve,success,vm,upload)
            .catch((e) => log('Error inserting data for ' + table,data,e));
    });
}

export function _update({ dispatch,commit },{ table,data,id,pk,condition,upload,create }){
    condition = condition || (_.zipObject([(pk || 'id')],[id])); let type = 'update';
    return new Promise((resolve) => {
        let now = __.now(); upload = (upload === undefined) ? true : upload; create = (create === undefined) ? true : create;
        DB.update(table,condition,data,function (now,table,data,resolve,dispatch,actUpload,create) {
            if(this.result){
                DB.get(table,{ updated_at:now,operator:'>=' },function(resolve,table,dispatch,actUpload){
                    let activity = getActivity(table,this.result,'update');
                    resolve(activity); if(actUpload) dispatch('triggerEventSubscribers',{ event:'activityUpload',payload:activity });
                },resolve,table,dispatch,actUpload);
                dispatch('postDBAction',{ table,type });
            } else {
                if(!create) return; data = _.merge(conditionToData(condition),data);
                dispatch('_insert',{ table,data,upload })
            }
        },now,table,data,resolve,dispatch,upload,create);
    });
}

export function postDBAction({ commit,dispatch }, {table, type}) {
    commit('Sync/' + update_table_timing,{ table,type },{ root:true });
    setTimeout(() => dispatch('redrawModules',table,{ root:true }),4000);
}

export function addEventSubscribers({state,commit},modulesMap) {
    let subscribableEvents = _.keys(state.actionEvents);
    _.forEach(modulesMap, ({ _rawModule }, Module) => {
        let module = _.trim(Module, '/'), moduleActions = _.keys(_rawModule.actions), events = _.intersection(subscribableEvents,moduleActions);
        if (events.length) events.forEach(event => commit(add_event_subscriber,{ module,event }))
    });
}

export function triggerEventSubscribers({state,dispatch},{ event,payload }) {
    if(_.has(state.actionEvents,event) && state.actionEvents[event].length !== 0){
        state.actionEvents[event].forEach(module => dispatch(module+'/'+event,payload,{ root:true }))
    }
}

function getActivity(table, data, mode, primary_key) {
    mode = mode || 'create'; primary_key = (primary_key) ? (Array.isArray(primary_key) ? primary_key : [primary_key]) : ['id'];
    return { table,primary_key,mode,data };
}
function conditionToData(condition){
    let rCond = {};
    if(_.isNumber(condition) || _.isString(condition) || _.isArray(condition)) return rCond;
    return _.omit(condition,['id','created_at','updated_at']);
}

import {
    mutate_sync_data, update_table_timing, add_module, bind_table_module, create_event_subscription, add_event_subscriber
} from "./mutation-types";

export function init({ dispatch,commit },modulesMap){
    _.forEach(modulesMap, ({ _rawModule }, Module) => {
        let module = _.trim(Module, '/'); commit(add_module, module);
        if (_rawModule.state.dbTables) commit(bind_table_module, { table: _rawModule.state.dbTables,  module });
        if (_.has(_rawModule.actions,'init')) dispatch(Module+'init').then(null);
        if (_rawModule.state.subscribeEvents && _rawModule.state.subscribeEvents.length)
            _rawModule.state.subscribeEvents.forEach(sEvent => commit(create_event_subscription,{ event:sEvent }))
    });
    dispatch('addEventSubscribers',modulesMap)
}

export function redrawModules({state, commit, rootState}, table) {
    if (!_.has(state.table_modules, table)) return;
    DB.get(table, null, function (modules, commit) {
        if (this.error) return;
        _.forEach(modules, (module) => {
            let mutation = module + '/' + mutate_sync_data;
            commit(mutation, {table: this.table(), data: this.result}, {root: true});
            if(rootState[module] && rootState[module]['list'] && !_.isEmpty(rootState[module]['list']))
                rootState[module]['list'] = [];
        });
    }, state.table_modules[table], commit);
}

export function _insert({ dispatch },{ table,data,success,vm }){
    return new Promise((resolve) => {
        let records = Array.isArray(data) ? data : [data], totalRecords = records.length;
        DB.insert(table,records,function (totalRecords,table,resolve,callback,vm) {
            let lastID = this.result, id = _.range(_.toSafeInteger(lastID),lastID-totalRecords); DB.get(table,id,function(resolve,table){
                resolve(getActivity(table,this.result,'create'));
            },resolve,table);
            dispatch('postDBAction',{ table,type:'create' });
            if(callback) if(_.isFunction(callback)) callback.call(vm,id); else vm[callback].call(vm,id);
        },totalRecords,table,resolve,success,vm)
    });
}

export function _update({ dispatch,commit },{ table,data,id,pk,condition }){
    condition = condition || (_.zipObject([(pk || 'id')],[id]));
    return new Promise((resolve) => {
        let now = __.now(); DB.update(table,condition,data,function (now,table,resolve,dispatch) {
            DB.get(table,{ updated_at:now,operator:'>=' },function(resolve,table){
                resolve(getActivity(table,this.result,'update'));
            },resolve,table);
            dispatch('postDBAction',{ table,type:'update' });
        },now,table,resolve,dispatch);
    });
}

export function postDBAction({ commit,dispatch }, {table, type}) {
    commit('Sync/' + update_table_timing,{ table,type },{ root:true });
    dispatch('redrawModules',table,{ root:true });
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

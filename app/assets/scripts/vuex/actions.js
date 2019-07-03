import {mutate_sync_data, update_table_timing} from "./mutation-types";

export function redrawModules({state, commit, rootState}, table) {
    if (!_.has(state.table_modules, table)) return;
    DB.get(table, null, function (modules, commit) {
        if (this.error) return;
        // let firstModule = _.head(modules);
        // let mutation = firstModule + '/' + mutate_sync_data;
        // commit(mutation, {table: this.table(), data: this.result}, {root: true});
        _.forEach(modules, (module) => {
            let mutation = module + '/' + mutate_sync_data;
            commit(mutation, {table: this.table(), data: this.result}, {root: true});
            if(rootState[module] && rootState[module]['list'] && !_.isEmpty(rootState[module]['list']))
                rootState[module]['list'] = [];
        });
    }, state.table_modules[table], commit);
}

export function _insert({ dispatch,commit,state },{ table,data,success,vm }){
    table = table || ( _.isArray(state.table) ? _.head(state.table) : state.table);
    return new Promise((res,rej) => {
        DB.insert(table,data,function (table,callback,vm,mutation,commit,dispatch,res) {
            commit('Sync/' + mutation,{ table,type:'create' },{ root:true });
            dispatch('redrawModules',table,{ root:true });
            if(callback) callback.call(vm,this.result);
            res(this.result);
        },table,success,vm,update_table_timing,commit,dispatch,res)
    });
}

export function _update({ dispatch,commit },{ table,data,id,pk,condition }){
    table = table || ( _.isArray(state.table) ? _.head(state.table) : state.table);
    condition = condition || (_.zipObject([(pk || 'id')],[id]));
    return new Promise((res, rej) => {
        DB.update(table, condition, data, function (table, mutation, commit, dispatch, res) {
            commit('Sync/' + mutation, {table, type: 'update'}, {root: true});
            dispatch('redrawModules', table, {root: true});
            res(this.result);
        }, table, update_table_timing, commit, dispatch,res);
    });
}
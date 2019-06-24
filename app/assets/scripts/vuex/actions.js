import {mutate_sync_data} from "./mutation-types";

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
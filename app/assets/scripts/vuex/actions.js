import {mutate_sync_data} from "./mutation-types";

export function redrawModules({state, commit}, table) {
    if (!_.has(state.table_modules, table)) return;
    DB.get(table, null, function (modules, commit) {
        if (this.error) return;
        _.forEach(modules, (module) => {
            let mutation = module + '/' + mutate_sync_data;
            commit(mutation, {table: this.table(), data: this.result}, {root: true});
        });
    }, state.table_modules[table], commit);
}
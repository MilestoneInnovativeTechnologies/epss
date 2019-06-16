import {add_module, bind_table_module} from './mutation-types';

export default {
    [add_module](state, mod) {
        mod = _.trim(mod,'/'); state.modules.push(mod);
    },
    [bind_table_module](state, { module,table }) {
        if(!_.has(state.module_tables,module)) Object.assign(state.module_tables,_.zipObject([module],[[]]));
        let tables = _.isArray(table) ? table : [table]; Array.prototype.push.apply(state.module_tables[module],tables);
        _.forEach(tables,(table) => {
            if(!_.has(state.table_modules,table)) Object.assign(state.table_modules,_.zipObject([table],[[]]));
            state.table_modules[table].push(module);
        });
    },
};
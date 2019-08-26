import {
    add_module,
    bind_table_module,
    add_connection_monitor,
    create_event_subscription, add_event_subscriber, remove_event_subscriber
} from './mutation-types';

export default {
    [add_module](state, mod) { state.modules.push(mod); },
    [add_connection_monitor](state, action) { state.connection_monitors.push(action); },
    [bind_table_module](state, { module,table }) {
        if(!_.has(state.module_tables,module)) Object.assign(state.module_tables,_.zipObject([module],[[]]));
        let tables = _.isArray(table) ? table : [table]; Array.prototype.push.apply(state.module_tables[module],tables);
        _.forEach(tables,(table) => {
            if(!_.has(state.table_modules,table)) Object.assign(state.table_modules,_.zipObject([table],[[]]));
            state.table_modules[table].push(module);
        });
    },
};
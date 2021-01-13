import Vue from 'vue';
import {
    add_module,
    bind_table_module,
    create_event_subscription,
    add_event_subscriber,
    remove_event_subscriber,
    set_state_data
} from './mutation-types';

export default {
    [add_module](state, mod) { state.modules.push(mod); },
    [bind_table_module](state, { module,table }) {
        if(!_.has(state.module_tables,module)) Object.assign(state.module_tables,_.zipObject([module],[[]]));
        let tables = _.isArray(table) ? table : [table]; Array.prototype.push.apply(state.module_tables[module],tables);
        _.forEach(tables,(table) => {
            if(!_.has(state.table_modules,table)) Object.assign(state.table_modules,_.zipObject([table],[[]]));
            state.table_modules[table].push(module);
        });
    },
    [create_event_subscription](state, { event }) {
        let actionEvents = state.actionEvents;
        if(!_.has(actionEvents,event)) state.actionEvents = Object.assign({},actionEvents,_.set({},event,[]));
    },
    [add_event_subscriber](state, { module,event }) {
        let actionEvents = state.actionEvents;
        if(!_.has(actionEvents,event)) state.actionEvents = Object.assign({},actionEvents,_.set({},event,[]));
        if(!_.includes(state.actionEvents[event],module)) state.actionEvents[event].push(module);
    },
    [remove_event_subscriber](state, { module,event }) {
        if(!state.actionEvents || !state.actionEvents[event] && !state.actionEvents[event].length) return;
        let actionEvents = state.actionEvents, idx = actionEvents[event].indexOf(module); if(idx === -1) return;
        state.actionEvents[event] = _.difference(state.actionEvents[event],[module])
    },
    [set_state_data](state, Obj) {
        _.forEach(Obj,(value, key) => Vue.set(state,key,value))
    },
};

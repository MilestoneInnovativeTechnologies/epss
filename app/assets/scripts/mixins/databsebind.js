import {mutate_sync_data, update_table_timing} from "../vuex/mutation-types";

export default {
    getState: () => { return {
        _data: {}
    } },
    mutations:{
        [mutate_sync_data](state, { table,data } ) {
            Object.assign(state._data,_.zipObject([table],[data]))
        },

    },
    actions:{
        _insert({ dispatch,commit,state },{ table,data }){
            table = table || ( _.isArray(state.table) ? _.head(state.table) : state.table);
            DB.insert(table,data,function (table,mutation,commit,dispatch) {
                commit('Sync/' + mutation,{ table,type:'create' },{ root:true });
                dispatch('redrawModules',table,{ root:true });
            },table,update_table_timing,commit,dispatch)
        },
        _update({ dispatch,commit },{ table,data,id,pk,condition }){
            table = table || ( _.isArray(state.table) ? _.head(state.table) : state.table);
            condition = condition || (_.zipObject([(pk || 'id')],[id]));
            DB.update(table,condition,data,function (table,mutation,commit,dispatch) {
                commit('Sync/' + mutation,{ table,type:'update' },{ root:true });
                dispatch('redrawModules',table,{ root:true });
            },table,update_table_timing,commit,dispatch,)
        }
    },
    getters:{

    }
}
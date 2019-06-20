import {mutate_sync_data, update_table_timing} from "../vuex/mutation-types";

export default {
    getState: () => { return {
        _data: {}
    } },
    mutations:{
        [mutate_sync_data](state, { table,data } ) {
            if(!_.has(state._data, table))
                state._data = Object.assign({},state._data,_.zipObject([table],[[]]));
            state._data[table].splice(0); Array.prototype.push.apply(state._data[table],data);
            // state._data[table] = data;
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
    getters: {
        __properTable({ _table }){
            return (table) => table || (_.isArray(_table) ? _table[0] : _table)
        },
        _tableData({ _data },{ __properTable }){
            return (table) => _data[__properTable(table)];
        },
        _tableDataById(state,{ _tableData }){
            return (table,id) => { return _.keyBy(_tableData(table),(id || 'id')) }
        },
        _tableDataByIdField(state,{ _tableDataById }){
            return (table,field) => { return _.mapValues(_tableDataById(table),(field || 'name')) }
        },
        _tableDataByIdName(state,{ _tableDataByIdField }){
            return (table) => { return _tableDataByIdField(table,'name') }
        },
        _tableDataItemByKey(state,{ _tableData }){
            return (table,key,value) => { return _.find(_tableData(table),mpkva(key,value)) }
        },
        _tableDataItem(state,{ _tableDataItemByKey }){
            return (table,id) => { return _tableDataItemByKey(table,'id',id) }
        },
        _tableDataFilter(state,{ _tableData }){
            return (table,key,value) => _.filter(_tableData(table),mpkva(key,value))
        },
        _tableDataItemRelation(state,{ _tableDataItem }){
            //[prdId,[['products','group1'],['productgroups','tax1'],'tax']]
            return (id,relationDeep,table) => { return _tableDataItem(table,_.reduce(relationDeep,function(id,relation){
                return _.get(_tableDataItem(relation[0],id),relation[1])
            },id)) }
        },
    }
}

function matchesPropertyKeyValueArray(key,value){
    let intKeys = ['id','created_at','updated_at'];
    let val = _.includes(intKeys,key) ? _.toSafeInteger(value) : _.toString(value);
    return [key,val];
}
function mpkva(key, value) {
    return matchesPropertyKeyValueArray(key, value)
}

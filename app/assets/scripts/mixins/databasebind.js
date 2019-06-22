import {increment_stock_cache, mutate_sync_data, stock_state_data, update_table_timing} from "../vuex/mutation-types";
import {stock_load_cache_refresh_on_each_nth_query} from "../constants";

export default {
    state: {
        dbData:[],
        stockActionCache:{},
    },
    mutations:{
        [mutate_sync_data](state, { table,data } ) {
            if(!_.has(state.dbData, table))
                state.dbData = Object.assign({},state.dbData,_.zipObject([table],[[]]));
            // state.dbData[table].splice(0); Array.prototype.push.apply(state.dbData[table],data);
            state.dbData[table] = data;
        },
        [stock_state_data](state, { key,path,data } ) {
            if(path) state[key] = Object.assign({},state[key],_.set({},path,data));
            else state[key] = Object.assign({},state[key],data);
        },
        [increment_stock_cache](state,path) {
            let cache = _.toSafeInteger(_.get(state.stockActionCache,path,0)) + 1;
            if(_.has(state.stockActionCache,path)) state.stockActionCache[path] = cache;
            else state.stockActionCache = Object.assign({},state.stockActionCache,_.zipObject([path],[cache]));
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
        },
        _stock({ commit },{ query,mutation,key,path }){
            mutation = mutation || stock_state_data;
            DB.getAllQuery(query,function(commit,mutation,key,path){
                if(this.error) return log('DB Bind Global Module > action:_stock > execQuery error.',this.executedQuery[0],this.result);
                commit(mutation,{ data:this.result,key,path });
            },[commit,mutation,key,path])
        },
        _stockIfNot({ state,dispatch,commit },payload){
            let fullPath = _.trim([payload.key,payload.path].join('.'),'.');
            if(_.isEmpty(_.get(state,fullPath))) return dispatch('_stock',payload);
            commit(increment_stock_cache,fullPath);
            let on = _.toSafeInteger(_.isNil(payload.on) ? stock_load_cache_refresh_on_each_nth_query : payload.on);
            if(on !== 0 && _.toSafeInteger(state.stockActionCache[fullPath])%(on) === 0) return dispatch('_stock',payload);
        }
    },
    getters: {
        __properTable({ dbTables }){
            return (table) => table || (_.isArray(dbTables) ? dbTables[0] : dbTables)
        },
        _tableData({ dbData },{ __properTable }){
            return (table) => dbData[__properTable(table)];
        },
        _tableDataAll({ dbData },{ _tableData,__properTable }){
            return _tableData(__properTable());
        },
        _tableDataByGroup(state,{ _tableData }){
            return (table,field) => { return _.groupBy(_tableData(table),field) }
        },
        _tableDataByField(state,{ _tableData }){
            return (table,field) => { return _.keyBy(_tableData(table),field) }
        },
        _tableDataById(state,{ _tableDataByField }){
            return (table) => { return _tableDataByField(table,'id') }
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
        _stateData(state){
            return (path) => { return _.get(state,path) }
        },
        _stateDataByGroup(state,{ _stateData }){
            return (path,field) => { return _.groupBy(_stateData(path),field) }
        },
        _stateDataByField(state,{ _stateData }){
            return (path,field) => { return _.keyBy(_stateData(path),field) }
        },
        _stateDataById(state,{ _stateDataByField }){
            return (path) => { return _stateDataByField(path,'id') }
        },
        _stateDataByIdField(state,{ _stateDataById }){
            return (path,field) => { return _.mapValues(_stateDataById(path),(field || 'name')) }
        },
        _stateDataByIdName(state,{ _stateDataByIdField }){
            return (path) => { return _stateDataByIdField(path,'name') }
        },
        _stateDataItemByKey(state,{ _stateData }){
            return (path,key,value) => { return _.find(_stateData(path),mpkva(key,value)) }
        },
        _stateDataItem(state,{ _stateDataItemByKey }){
            return (path,id) => { return _stateDataItemByKey(path,'id',id) }
        },
        _stateDataFilter(state,{ _stateData }){
            return (path,key,value) => _.filter(_stateData(path),mpkva(key,value))
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

import { databse_fetch_url,table_information_db_table_name } from './../../constants';

export function Setup({ dispatch,rootGetters }){
    log('Initializing Database fetch');
    DB.get('organization',null,function(dispatch,rootGetters){
        dispatch('Organization/lightUpApp',{ data:this.result,uuid:rootGetters['Organization/client'] },{ root:true });
        dispatch('get',{ url:databse_fetch_url,success:'Database/create' },{ root:true })
    },dispatch,rootGetters);
}

export function create({ dispatch }, data) {
    DB.create(table_information_db_table_name,'table,fields,type,up,down',function(data, dispatch){
        if(this.error) return log(`Error in creating ${table_information_db_table_name} db table`,this.result);
        log('Deleting client from server'); dispatch('Sync/deleteClient',null,{ root:true });
        log('Initializing database table creates',data);
        _.forEach(data,(Ary,Table) => { DB.create(Table,Ary[0],function(table,fields,type,down,up,dispatch){
            DB.insert(table_information_db_table_name,{ table,fields,type,down,up },function(table, dispatch){
            },table,dispatch);
        },Table,Ary[0],Ary[1],Ary[2],Ary[3],dispatch); });
    },data,dispatch);
}
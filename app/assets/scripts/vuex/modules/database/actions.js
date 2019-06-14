import { database_fetch_url,table_information_db_table_name } from './../../constants';
import { add_new_table_for_sync } from './../../mutation-types';

export function Setup({ dispatch }){
    log('Initializing Database fetch');
    dispatch('get',{ url:database_fetch_url,success:'Database/create' },{ root:true })
}

export function create({ dispatch,commit }, data) {
    DB.create(table_information_db_table_name,'table,fields,type,up,down',function(data, dispatch){
        if(this.error) return log(`Error in creating ${table_information_db_table_name} db table`,this.result);
        _.forEach(data,(Ary,Table) => {
            log('Creating Table: ' + Table);
            DB.create(Table,Ary[0],function(table,fields,type,down,up,dispatch,commit){
                log('Created Table: ' + table); log('Inserting Table Information for, ' + table);
                DB.insert(table_information_db_table_name,{ table,fields,type,down,up },function(table,type,dispatch){
                    dispatch('Sync/downloadTableRecords',table,{ root:true });
                    },table,type,dispatch);
                commit('Sync/' + add_new_table_for_sync,{ table,up,down,type },{ root:true })
                },Table,Ary[0],Ary[1],_.toSafeInteger(parseInt(Ary[2])*3600),_.toSafeInteger(parseInt(Ary[3])*60),dispatch,commit);

        });
        },data,dispatch,commit);
}
import {
    database_fetch_url,
    table_information_db_table_fields,
    table_information_db_table_name
} from './../../constants';

export function Setup({ dispatch }){
    log('Initializing Database fetch');
    dispatch('get',{ url:database_fetch_url,success:'Database/create' },{ root:true })
}

export function create({dispatch}, data) {
    DB.create(table_information_db_table_name, table_information_db_table_fields, function (data, dispatch) {
        if (this.error) return log(`Error in creating ${table_information_db_table_name} db table`, this.result);
        _.forEach(data, (Ary, Table) => {
            if (!Table) return; log('Creating Table: ' + Table);
            DB.create(Table, Ary[0], function (table, fields, type, down, up, dispatch) {
                log('Created, ' + table + ', Inserting Information');
                let insertData = {table, fields, type, down, up};
                DB.insert(table_information_db_table_name, insertData, function (tblObj, dispatch) {
                    if (tblObj.type === 'APP') dispatch('Sync/downloadTableRecords', tblObj, {root: true});
                }, insertData, dispatch);
            }, Table, Ary[0], Ary[1], _.toSafeInteger(parseInt(Ary[2]) * 3600), _.toSafeInteger(parseInt(Ary[3]) * 60), dispatch);
        });
    }, data, dispatch);
}
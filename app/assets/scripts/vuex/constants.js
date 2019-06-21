export const organization_fetch_url = 'http://milestoneit.net/api/ss/device';
export const database_fetch_url = 'http://milestoneit.net/api/ss/setup';

//Module Common
export const stock_load_cache_refresh_on_each_nth_query = 3;

//database
export const table_information_db_table_name = 'table_information';
export const table_information_db_table_fields = 'table,fields,type,up,down,sync,next,update,create';

//sync
export const setup_sync_table_after = 4;
export const init_sync_table_after = 10;
export const init_sync_user_table_after = 1;
export const sync_recheck_timeout_seconds = 3;
export const gap_between_sync_queue_seconds = 3;
export const app_user_create_date_for_fetch = '1900-01-01 00:00:01';
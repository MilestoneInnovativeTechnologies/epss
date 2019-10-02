export const organization_fetch_url = 'http://milestoneit.net/api/ss/device';
export const database_fetch_url = 'http://milestoneit.net/api/ss/setup';
export const sse_monitor_path = 'sse/info';
export const no_image_file = '~/assets/images/no-image.jpg';
export const product_image_path = 'image/item';

//Module Common
export const stock_load_cache_refresh_on_each_nth_query = 0;

//app
export const table_information_db_table_name = 'epss_tblinfo';
export const table_information_db_table_fields = 'table,fields,type,direction,create,update,download,upload';

//sync
export const download_common_params = { format: 'json',  type: 'data' };
export const max_sync_download_retry_count = 1;
export const app_user_create_date_for_fetch = '1900-01-01 00:00:01';
export const sync_create_chunk_length = 500;
export const sync_success_response_global_action = 'Sync/syncDataReceived';
export const sync_failure_response_global_action = 'Sync/syncDataFail';
export const approx_time_for_a_sync = 1;
export const gap_between_sync_queue_seconds = 1;
export const init_sync_user_table_after = 1;

//axios
export const maximum_processing_seconds = 30;

//upload
export const maximum_upload_retry_count = 1;
export const maximum_upload_processing_time = 35;
export const clear_upload_completed_delay = 90;

//Product
export const product_image_cache_max_request = 10;

//Drawer Component
export const drawer_content_size_percent = 10;
export const drawer_content_size_max = 400;
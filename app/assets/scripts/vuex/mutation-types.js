//Root
export const add_module = 'addModule';
export const bind_table_module = 'bindTableModule';
export const create_event_subscription = 'createEventSubscription';
export const add_event_subscriber = 'addEventSubscriber';
export const remove_event_subscriber = 'removeEventSubscriber';

//Connection
export const add_connection_monitor = 'addConnectionMonitorAction';
export const set_connectivity_availability = 'setConnectivityAvailable';

//App

//Helper

//Module Common
export const mutate_sync_data = 'mutateSyncData';
export const stock_state_data = 'stockStateData';
export const increment_stock_cache = 'incrementStockCache';
export const set_state_data = 'setStateData';

export const add_message_to_log_queue = 'addQueue';

export const add_configuration_to_server_queue = 'addQueue';
export const start_process_queue = 'initQueueProcess';
export const initiate_processing_transfer = 'initTransfer';
export const finalize_processing_transfer = 'finalizeTransfer';
export const finalize_failed_transfer = 'failedTransfer';

//Sync
export const add_new_table_for_sync = 'newTable';
export const add_to_sync_download_queue = 'addSyncDownloadItems';
export const remove_first_sync_download_queue_item = 'removeSyncDownloadFirstItem';
export const increment_sync_download_failure_count = 'incrementSyncDownloadFailureCount';
export const add_to_app_sync_queue = 'addToAppQueue';
export const processing_queue = 'processQueue';
export const finish_processing_queue = 'finishProcessingSync';
export const set_repeat_failed_timeout = 'setRepeatFailedTimeout';
export const update_table_timing = 'updateTableTime';
export const set_new_sync_time_out = 'setTimeOut';

//User
export const set_user_pin = 'setPin';

//Upload
export const set_latest_upload_queue_id = 'setUploadQueueLatest';
export const increment_upload_retry_count = 'incrementUploadRetryCount';

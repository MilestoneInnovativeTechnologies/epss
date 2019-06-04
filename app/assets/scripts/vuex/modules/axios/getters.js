export function queue_count(state) { return state.queue.length; }
export function url_api(state) { return (path) => [_.trim(state.url_api,'\\/'),_.trim(path,'\\/')].join('/'); }


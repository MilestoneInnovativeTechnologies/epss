import {
    increment_upload_retry_count,
    set_latest_upload_queue_id,
    set_state_data,
    set_upload_data
} from '../../mutation-types';

export default {
    [set_latest_upload_queue_id](state, id) { if(id) state.latest = id; },
    [set_state_data](state, data) { [].concat(data).forEach(({ key,value }) => state[key] = value); },
    [increment_upload_retry_count](state) { state['retry_count']++; },
    [set_upload_data](state,data) {
        let params = getParams(data);
        let sData = _.zipObject(['id','url','params','success','fail'],[data.id,data.url,params,'Upload/'+data.onsuccess,'Upload/'+data.onfail]);
        state['uData'] = Object.assign({},sData);
    },
};

function getParams(data) {
    return { content:data.content,_user:data.user,uuid:data.uuid,format:'json',type:'data' }
}

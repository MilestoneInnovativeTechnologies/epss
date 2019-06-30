import {set_organization_details, set_device_uuid, populate_organisation_data} from '../../mutation-types';

export default {
    [set_organization_details](state, infos) {
        _.forEach(state.fetch,(key) => { state[key] = _.get(infos,key); });
    },
    [set_device_uuid](state, uuid) {
        state.uuid = uuid;
    },
    [populate_organisation_data](state, data) {
        let stateKeys = ['code','name','image','brief','print_head_text1','print_head_text2','footer_text','url_web','url_api','url_interact'];
        data = _.mapValues(_.keyBy(data,'name'),'detail');
        _.forEach(stateKeys,(key) => state[key] = data[key])
    },
};

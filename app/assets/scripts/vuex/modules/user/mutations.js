import {set_user_email, set_user_password, set_user_pin, update_login_details} from '../../mutation-types';

export default {
    [set_user_email](state, data) { state.email = data },
    [set_user_password](state, data) { state.password = data; },
    [set_user_pin](state, data) { state.pin = data; },
    [update_login_details](state, data) { _.forEach(['name','email','id','api_token','reference'],(k) => state[k] = data[k] ) },
};

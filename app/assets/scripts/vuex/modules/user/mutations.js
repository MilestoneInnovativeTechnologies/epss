import {
    clear_login_message, init_login_validation, login_validation_failed,
    set_user_email,
    set_user_password,
    set_user_pin,
    update_login_details
} from '../../mutation-types';

export default {
    [set_user_email](state, data) { state.email = data },
    [set_user_password](state, data) { state.password = data; },
    [set_user_pin](state, data) { state.pin = data; },
    [update_login_details](state, data) { state.validating = false; _.forEach(['name','email','id','api_token','reference'],(k) => state[k] = data[k] ) },
    [init_login_validation](state) { state.validating = true; state.message = ''; },
    [login_validation_failed](state) { state.validating = false; state.message = 'No email and password matching records found'; },
    [clear_login_message](state) { state.message = '' },
};

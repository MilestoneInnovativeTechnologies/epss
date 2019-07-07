import { set_user_pin } from '../../mutation-types';

export default {
    [set_user_pin](state, data) { state.pin = data; },
};

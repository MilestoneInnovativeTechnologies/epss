import {set_connectivity_availability} from '../../mutation-types';

export default {
    [set_connectivity_availability](state,status) { state.status = status },
};

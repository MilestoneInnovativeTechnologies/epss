import { mutate_sync_data } from '../vuex/mutation-types';

export default {
    [mutate_sync_data](state, { table,data } ) {
        Object.assign(state._data,_.zipObject([table],[data]))
    },
};

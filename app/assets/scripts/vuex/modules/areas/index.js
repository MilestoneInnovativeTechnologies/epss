import * as actions from './actions';
import mutations from './mutations';
import * as getters from './getters';
import state from './state';

import dbBind from './../../../mixins/databsebind'
export default {
    namespaced: true,
    mutations:{
        ...dbBind.mutations,
        ...mutations
    },
    actions:{
        ...dbBind.actions,
        ...actions,
    },
    state:{
        _data:{},
        ...state,
    },
    getters: {
        ...dbBind.getters,
        ...getters,
    }
};

import Vue from 'nativescript-vue';
import Vuex from 'vuex';

import state from './state';
import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';

import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
    state, getters, mutations, actions, modules
});

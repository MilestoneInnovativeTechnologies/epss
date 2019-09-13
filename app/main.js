import Vue from 'nativescript-vue'
import Home from './components/Home'
import {TNSFontIcon, fonticon} from 'nativescript-fonticon';

global._ = require('lodash'); global.moment = require('moment'); global.__ = {}; global.sql = require('sqlstring');
global.DB = require('./assets/scripts/services/database').DB; global.EB = new Vue();

import "./app.scss";
import "./app.css";

import store from './assets/scripts/vuex/store';
global.log = function(text,...texts){ store.commit('Log/addQueue',text); if(TNS_ENV !== 'production') console.log(text,...texts); };

import VueDevtools from 'nativescript-vue-devtools'
if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools,{ host:'192.168.10.11' })
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = true;//(TNS_ENV === 'production');

// TNSFontIcon.debug = true;
TNSFontIcon.paths = {
    'mi': './assets/styles/mi.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

require('./components/index');

new Vue({
    store,
    render: h => h('frame', [h(Home)]),
    mounted() {
        let vuexStore = this.$store;
        this.$nextTick(function () {
            vuexStore.dispatch('init', _.cloneDeep(vuexStore._modulesNamespaceMap)).then(null);
        });
    },
}).$start();

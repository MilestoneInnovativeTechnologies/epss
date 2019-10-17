import Vue from 'nativescript-vue'
import Home from './components/Home'
import {TNSFontIcon, fonticon} from 'nativescript-fonticon';

global._ = require('lodash'); global.moment = require('moment'); global.__ = {}; global.sql = require('sqlstring');
global.DB = require('./assets/scripts/services/database').DB; global.EB = require('./assets/scripts/services/EventBus').EventBus;
global.print = require('./assets/scripts/services/Printer.js').print;

import "./app.scss";
import "./app.css";

global.VuexStore = require('./assets/scripts/vuex/store').default;
global.log = function(text,...texts){ VuexStore.commit('Log/addQueue',text); if(TNS_ENV !== 'production') console.log(text,...texts); };

// import VueDevtools from 'nativescript-vue-devtools'
// if(TNS_ENV !== 'production') {
//   Vue.use(VueDevtools,{ host:'192.168.10.11' })
// }

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');

TNSFontIcon.debug = false;
TNSFontIcon.paths = {
    'mi': './assets/styles/mi.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

require('./components/index');

new Vue({
    store: VuexStore,
    render: h => h('frame', [h(Home)]),
    mounted() {
        let vuexStore = this.$store;
        this.$nextTick(function () {
            vuexStore.dispatch('init', _.cloneDeep(vuexStore._modulesNamespaceMap)).then(null);
        });
    },
}).$start();

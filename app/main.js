import Vue from 'nativescript-vue'
import App from './components/App'

global._ = require('lodash');
global.DB = require('./assets/scripts/services/database').DB;

import "./app.scss";
import "./app.css";

Vue.config.devtools = true;
import VueDevtools from 'nativescript-vue-devtools'
if(TNS_ENV !== 'production') { Vue.use(VueDevtools, { host:'192.168.43.48' }); }
Vue.config.silent = (TNS_ENV === 'production'); // Prints Vue logs when --env.production is *NOT* set while building

import store from './assets/scripts/vuex/store';
global.log = function(text,...texts){ store.commit('Log/addQueue',text); if(TNS_ENV !== 'production') console.log(text,...texts); };

import {TNSFontIcon, fonticon} from 'nativescript-fonticon';
TNSFontIcon.debug = true;
TNSFontIcon.paths = {
    'fa': './assets/styles/fa.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

require('./components/index');

global.VueApp = new Vue({
    store,
    mounted(){
        let vuex = this.$store;
        _.forEach(vuex._modulesNamespaceMap,(Obj,Module) => {
            let init = Module + 'init'; if(vuex._actions[init]) vuex.dispatch(init).then(null);
        })
    },
    render: h => h('frame', [h(App)])
}).$start();

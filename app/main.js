import Vue from 'nativescript-vue'
import Home from './components/Home'

global._ = require('lodash'); global.moment = require('moment'); global.__ = {}; global.sql = require('sqlstring');
global.DB = require('./assets/scripts/services/database').DB;
global.FD = require('./assets/scripts/services/formdata').FD;

import "./app.scss";
import "./app.css";

Vue.config.devtools = true;
import VueDevtools from 'nativescript-vue-devtools'
if(TNS_ENV !== 'production') { Vue.use(VueDevtools, { host:'192.168.43.48' }); }
Vue.config.silent = (TNS_ENV === 'production'); // Prints Vue logs when --env.production is *NOT* set while building

import store from './assets/scripts/vuex/store';
global.log = function(text,...texts){ store.commit('Log/addQueue',text); if(TNS_ENV !== 'production') console.log(text,...texts); };

import {TNSFontIcon, fonticon} from 'nativescript-fonticon';
// TNSFontIcon.debug = true;
TNSFontIcon.paths = {
    'mi': './assets/styles/mi.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

require('./components/index');

import {add_module, bind_table_module} from "./assets/scripts/vuex/mutation-types";

global.VueApp = new Vue({
    store,
    mounted(){
        let vuex = this.$store, actions = [];
        _.forEach(vuex._modulesNamespaceMap,(Obj,Module) => {
            let module =_.trim(Module,'/'); vuex.commit(add_module,Module);
            if(vuex.state[module].dbTables) vuex.commit(bind_table_module,{ table:vuex.state[module].dbTables, module });
            let init = Module + 'init'; if(vuex._actions[init]) actions.push(init);
        });
        _.forEach(actions,(action) => vuex.dispatch(action).then(null));
    },
    render: h => h('frame', [h(Home)])
}).$start();

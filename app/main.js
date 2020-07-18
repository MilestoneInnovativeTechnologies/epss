import Vue from 'nativescript-vue'
import Home from './components/Home'

import "./assets/scripts/debugs";
import "./main.scss";

require('./assets/scripts/globals');
require('./assets/scripts/fonticons');
require('./assets/scripts/filters');

global.VuexStore = require('./assets/scripts/vuex/store').default;
global.log = function(text,...texts){ VuexStore.commit('Log/addQueue',text); if(TNS_ENV !== 'production') console.log(text,...texts); };

require('./components/index');

global.VueApp = new Vue({
    store: VuexStore,
    render: h => h('frame', [h(Home)]),
    mounted() {
        this.$nextTick(() => this.$store.dispatch('init', _.cloneDeep(this.$store._modulesNamespaceMap)).then(null));
    },
}).$start();

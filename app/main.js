import Vue from 'nativescript-vue'
import Home from './components/Home'
import "./app.scss";

require('./assets/scripts/globals');
require('./assets/scripts/debugs');
require('./assets/scripts/fonticons');

global.VuexStore = require('./assets/scripts/vuex/store').default;
global.log = function(text,...texts){ VuexStore.commit('Log/addQueue',text); if(TNS_ENV !== 'production') console.log(text,...texts); };

require('./components/index');

new Vue({
    store: VuexStore,
    render: h => h('frame', [h(Home)]),
    mounted() {
        this.$nextTick(() => this.$store.dispatch('init', _.cloneDeep(this.$store._modulesNamespaceMap)).then(null));
    },
}).$start();

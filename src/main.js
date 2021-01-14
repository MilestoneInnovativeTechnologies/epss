import Vue from 'nativescript-vue'
import App from './components/Home'

import store from './assets/scripts/vuex/store'
global.log = function(text,...texts){ store.commit('Log/addQueue',text); if(TNS_ENV !== 'production') console.log(text,...texts); };

require('./assets/scripts/globals');
require('./assets/scripts/fonticons');
require('./assets/scripts/filters');

require('./components/index');


new Vue({
  store,
  render: h => h('frame', [h(App)]),
  mounted() {
    this.$nextTick(() => this.$store.dispatch('init', _.cloneDeep(this.$store._modulesNamespaceMap)).then(null));
  },
}).$start()

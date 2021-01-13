import Vue from 'nativescript-vue'
import App from './components/Home'
import VueDevtools from 'nativescript-vue-devtools'


import store from './assets/scripts/vuex/store'
global.log = function(text,...texts){ store.commit('Log/addQueue',text); if(TNS_ENV !== 'production') console.log(text,...texts); };

Vue.config.silent = !false; //(TNS_ENV === 'production')
if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}

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

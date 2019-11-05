import Vue from 'nativescript-vue';
import VueDevtools from 'nativescript-vue-devtools'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools,{ host:'192.168.10.11' });
  Vue.config.silent = false;
}
import Vue from 'nativescript-vue';
import VueDevtools from 'nativescript-vue-devtools'

// global.FSM = require('tns-core-modules/file-system');
// global.ImgSrc = require('tns-core-modules/image-source');

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools,{ host:'192.168.10.11' });
  Vue.config.silent = false;
}

// global.pt = new (require('./services/PrintTemplate').PrintTemplate)();

import VueDevtools from 'nativescript-vue-devtools'
import Vue from 'nativescript-vue';

// global.FSM = require('tns-core-modules/file-system');
// global.ImgSrc = require('tns-core-modules/image-source');
// global.platform = require('tns-core-modules/platform');

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools,{ host:'192.168.10.102' });
  Vue.config.silent = false;
}
//
// global.pt = new (require('./services/PrintTemplate').PrintTemplate)();

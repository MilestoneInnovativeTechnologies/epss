import Vue from 'nativescript-vue';

import RadDataForm from 'nativescript-ui-dataform/vue';
Vue.use(RadDataForm);

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer);

const files = require.context('./', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));


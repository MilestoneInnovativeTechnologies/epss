import Vue from 'nativescript-vue';

// import RadDataForm from 'nativescript-ui-dataform/vue';






// Vue.use(RadDataForm);

const files = require.context('./', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));


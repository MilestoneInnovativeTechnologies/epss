import Vue from 'nativescript-vue'

Vue.filter('docdate',date => __.docdate(date));
Vue.filter('rate',rate => __.rate(rate));
Vue.filter('amount',amount => __.amount(amount));
Vue.filter('quantity',quantity => __.quantity(quantity));

import Vue from 'nativescript-vue'
import {TNSFontIcon, fonticon} from 'nativescript-fonticon';

TNSFontIcon.debug = false;
TNSFontIcon.paths = {
    'mi': './../styles/mi.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

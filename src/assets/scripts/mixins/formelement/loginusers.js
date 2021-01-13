import { mapState,mapActions } from "vuex";
import { get_all_se_login } from "../../queries";

const timer = require('@nativescript/core/timer');

export const FormElementMixinLoginUsers = {
    computed: {
        ...mapState('Users',{ feSELogin:'SELogin' }),
        feValuesLoginUsers(){
            let feSELogin = this.feSELogin;
            return _.map(feSELogin,'login').join(',');
        },
        feFieldLoginUsers(){ return { name:'login',label:'Select login ID',type:'Picker',values:this.feValuesLoginUsers } }
    },
    methods: {
        ...mapActions({ feListFetchLoginUsers: 'Users/_stock' }),
    },
    created() {
        this.feListFetchLoginUsers({ query:sql.format(get_all_se_login),key:'SELogin',on:5 });
        // timer.setTimeout(() => this.feListFetchLoginUsers({ query:sql.format(get_all_se_login),key:'SELogin',on:5 }),this.feSELogin.length ? 2000 : 1)
    }
};
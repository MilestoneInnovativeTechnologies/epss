import { mapActions } from 'vuex'
const Login = require('../../../components/login/Login').default;

export const logoutMixin = {
    methods: {
        ...mapActions('User',{ userLogoutAction:'logout' }),
        userLogout(){ this.userLogoutAction().then(() => this.$navigateTo(Login,{ clearHistory:true }) ) }
    }
};
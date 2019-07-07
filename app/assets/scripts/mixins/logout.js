import { mapActions } from 'vuex'
const Login = require('./../../../components/Login').default;

export const logoutMixin = {
    methods: {
        ...mapActions('User',{ userLogoutAction:'logout' }),
        userLogout(){ this.userLogoutAction().then(() => this.$navigateTo(Login,{ backstackVisible:true }) ) }
    }
};
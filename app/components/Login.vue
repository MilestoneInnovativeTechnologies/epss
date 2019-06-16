<!--suppress ALL -->
<template>
    <StackLayout width="75%" class="m-t-20">
        <AbsoluteLayout>
            <StackLayout width="100%">
                <TextHeading class="text-center">LOGIN</TextHeading>
                <TextField v-model="email" hint="Email" class="cp fsi" @returnPress="focusPassword" />
                <TextField v-model="password" hint="Password"  @returnPress="login" class="cp fsi" secure="true" ref="password" />
                <Button text="Login" width="50%" :isEnabled="!validating" @tap="login" class="btn btn-primary btn-active bcp" />
                <Button text="Home" width="50%" @tap="home" class="btn btn-primary btn-active bcp" />
            </StackLayout>
            <StackLayout width="100%" height="175">
                <ActivityIndicator :busy="validating" class="m-t-30"></ActivityIndicator>
            </StackLayout>
        </AbsoluteLayout>
    </StackLayout>
</template>

<script>
    import {set_user_email, set_user_password, clear_login_message } from './../assets/scripts/vuex/mutation-types'
    import { createNamespacedHelpers } from 'vuex';
    const { mapGetters,mapActions,mapState,mapMutations } = createNamespacedHelpers('User');
    const nspermission = require('nativescript-permissions');
    import Home from './Home'
    export default {
        name: 'Login',
        data: () => _.zipObject([],[]),
        computed:{
            ...mapState(['id','api_token','validating','message']),
            email:{ get(){ return this.$store.state['User'].email },  set(val){ this.$store.commit('User/' + set_user_email,val) } },
            password:{ get(){ return this.$store.state['User'].password },  set(val){ this.$store.commit('User/' + set_user_password,val) } },
        },
        methods: {
            ...mapActions(['login']),
            focusPassword(){ this.$refs.password.nativeView.focus() },
            ...mapMutations([clear_login_message]),
            home(){
                this.$navigateTo(Home);
            }
        },
        mounted(){
            this.email = 'SE01.sls@temp.mail';
            this.password = '123456';
            this.login();
        },
        watch: {
            message:function(val){ if(_.isEmpty(val)) return; alert({ title:'Login Error', message:val, okButtonText:'Ok' }).then(()=>this[clear_login_message]()) }
        },
    }
</script>

<style scoped></style>

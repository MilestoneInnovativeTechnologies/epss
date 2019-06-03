<!--suppress ALL -->
<template>
    <StackLayout width="75%" class="m-t-20">
        <Label text="LOGIN" class="font-weight-bold text-center t-20" />
        <TextField v-model="email" hint="Email" class="cp fsi" @returnPress="focusPassword()" />
        <TextField v-model="password" hint="Password"  @returnPress="submit()" class="cp fsi" secure="true" ref="password" />
        <Button text="Login" width="50%" @tap="submit()" class="btn btn-primary btn-active bcp" />
    </StackLayout>
</template>

<script>
    import {set_user_email, set_user_password} from './../assets/scripts/vuex/mutation-types'
    import { createNamespacedHelpers } from 'vuex';
    const { mapGetters,mapActions } = createNamespacedHelpers('User');
    const nspermission = require('nativescript-permissions');
    export default {
        name: 'Login',
        data: () => _.zipObject([],[]),
        computed:{
            email:{ get(){ return this.$store.state['User'].email },  set(val){ this.$store.commit('User/' + set_user_email,val) } },
            password:{ get(){ return this.$store.state['User'].password },  set(val){ this.$store.commit('User/' + set_user_password,val) } },
        },
        methods: {
            submit(){ log('submit') },
            focusPassword(){ this.$refs.password.nativeView.focus() }
        }
    }
</script>

<style scoped></style>

<template>
    <AbsoluteLayout>
        <StackLayout width="100%">
            <StackLayout v-if="encNotOk" width="80%" class="p-30 text-center" style="color: #FF0000; border-color: #FF0000; border-width: 2">
                <Label :textWrap="true" text="It seems that your ePlus Password Encoding is not configured as UTF8. Login won't work for other encoding types, So please make your ePlus Password Encoding to UTF8 and do at least one login in ePlus.!" />
            </StackLayout>
            <AppForm title="Login" :fields="fields()" :values="values" @final="updateCredentials"></AppForm>
        </StackLayout>
        <StackLayout width="100%" height="175">
            <ActivityIndicator :busy="validating" class="m-t-30"></ActivityIndicator>
        </StackLayout>
    </AbsoluteLayout>
</template>

<script>
    import {set_state_data } from '../../assets/scripts/vuex/mutation-types'
    import { mapState,mapGetters,mapMutations } from 'vuex';
    const feMX = require('./../../assets/scripts/mixins/formelement');

    export default {
        name: "LoginForm",
        mixins: [feMX.common,feMX.loginusers,feMX.password],
        computed:{
            ...mapState('User',['validating']), ...mapGetters('User',['credentials']),
            values(){ return { login:this.credentials.login,password:this.credentials.password } },
            encNotOk(){ return __.PASSWORDENCODING !== 'Utf8' },
        },
        methods: {
            ...mapMutations('User',[set_state_data]),
            fields(){ return this.appFormFields({ login:'LoginUsers',password:'Password' }) },
            updateCredentials(data){ let vm = this; _.forEach(data,(value,field) => vm[set_state_data](_.set({},field,value))) },
        },
    }
</script>
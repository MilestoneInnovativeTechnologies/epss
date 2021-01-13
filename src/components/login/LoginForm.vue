<template>
    <AbsoluteLayout>
        <StackLayout width="100%">
            <StackLayout v-if="encNotOk" width="80%" class="p-30 text-center" style="color: #FF0000; border-color: #FF0000; border-width: 2">
                <Label :textWrap="true" text="It seems that your ePlus Password Encoding is not configured as UTF8. Login won't work for other encoding types, So please make your ePlus Password Encoding to UTF8 and do at least one login in ePlus.!" />
            </StackLayout>
            <AppForm title="Login" :fields="fields()" :values="{ login:credentials.login,password:credentials.password }" @final="$emit('credentials',$event)" />
        </StackLayout>
        <StackLayout width="100%" height="175">
            <ActivityIndicator :busy="validating" class="m-t-30" />
        </StackLayout>
    </AbsoluteLayout>
</template>

<script>
    import { mapState,mapGetters } from 'vuex';
    const feMX = require('./../../assets/scripts/mixins/formelement');

    export default {
        name: "LoginForm",
        mixins: [feMX.common,feMX.loginusers,feMX.password],
        computed:{
            ...mapState('User',['validating']), ...mapGetters('User',['credentials']),
            encNotOk(){ return __.PASSWORDENCODING !== 'Utf8' },
        },
        methods: {
            fields(){ return this.appFormFields({ login:'LoginUsers',password:'Password' }) },
        },
    }
</script>
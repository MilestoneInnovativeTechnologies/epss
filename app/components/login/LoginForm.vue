<template>
    <AbsoluteLayout>
        <StackLayout width="100%">
            <TextRegular class="cp">Email</TextRegular>
            <TextField v-model="email" hint="Email" class="cp fsi" @returnPress="focusPassword"></TextField>
            <TextRegular class="cp m-t-10">Password</TextRegular>
            <TextField v-model="password" hint="Password" class="cp fsi" secure="true" ref="password"></TextField>
        </StackLayout>
        <StackLayout width="100%" height="175">
            <ActivityIndicator :busy="validating" class="m-t-30"></ActivityIndicator>
        </StackLayout>
    </AbsoluteLayout>
</template>

<script>
    import {set_state_data} from '../../assets/scripts/vuex/mutation-types'
    import { mapState,mapGetters,mapMutations } from 'vuex';

    export default {
        name: "LoginForm",
        computed:{
            ...mapState('User',['validating']), ...mapGetters('User',['credentials']),
            email:{ get(){ return this.credentials.email },  set(val){ this[set_state_data](_.set({},'email',val)) } },
            password:{ get(){ return this.credentials.password },  set(val){ this[set_state_data](_.set({},'password',val)) } },
        },
        methods: {
            ...mapMutations('User',[set_state_data]),
            focusPassword(){ this.$refs.password.nativeView.focus() },
        },
        mounted(){
            this.email = 'SE01.sls@temp.mail';
            this.password = '123456';
        },
    }
</script>
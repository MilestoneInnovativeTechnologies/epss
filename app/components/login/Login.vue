<!--suppress ALL -->
<template>
    <App title="Login" :action="loginForm ? 'Login' : null" back="false" drawer="false" @login="authenticate" width="100%">
        <GridLayout rows="auto,auto,*" class="w-full">
            <Organization row="0"></Organization>
            <LoginForm row="1" width="85%" class="m-t-30" v-if="loginForm"></LoginForm>
            <StackLayout row="2" class="m-t-8 w-full">
                <ActivityIndicator :busy="busy" class="m-t-10"></ActivityIndicator>
                <TextHighlight class="w-full text-center" v-for="(pTxt,idx) in pTexts" :text="pTxt" :key="'ull-'+idx"></TextHighlight>
            </StackLayout>
        </GridLayout>
    </App>
</template>

<script>
    import { mapGetters,mapActions,mapState,mapMutations } from 'vuex';
    import {set_state_data} from "../../assets/scripts/vuex/mutation-types";

    export default {
        name: 'Login',
        data(){ return {
            busy: false,
            loginForm: false,
            pTexts: [],
            maxHomeNavDelay: 15,
        }},
        computed: {
            ...mapState('User',['message','validating','id']),...mapState('Sync',['queue_index']),
            authenticated(){ let id = this.id; return !(_.isNil(id)) }
        },
        methods: {
            ...mapActions('User',['doLogin','doLoginActions']), ...mapMutations('User',[set_state_data]),
            pTxt(txt){ this.pTexts.push(txt) },
            authenticate(){
                this.pTxt('Authenticating with server....');
                this.doLogin();
            },
            checkLogin(){
                this.pTxt('Checking loging details in Database..'); this.busy = true;
                DB.get('user',null,function(vm){
                    if(this.error) return setTimeout((vm) => vm.$navigateTo(require('../misc/Setup').default,{ backstackVisible:false }),500,vm);
                    if(_.isEmpty(this.result)) return vm.initLogin();
                    vm.populateUserData(this.result)
                },this)
            },
            redirectToHome(after){
                this.pTxt(`You will be redirected to home page within ${after} seconds!!`);
                setTimeout(() => this.$navigateTo(require('../Home').default),after*1000);
            },
            populateUserData(data){
                this.pTxt('User data found, populating..');
                let kData =_(data).keyBy('name').mapValues(({ detail }) => detail).value();
                this.pTxt('Doing post login actions..');
                this.doLoginActions(kData).then(() => this.redirectToHome(this.delay()));
            },
            initLogin(){
                this.pTxt('No data found, try loging in using form..');
                this.loginForm = true; this.busy = false;
            },
            postFormLogin(data){
                this.busy = true; this.loginForm = false;
                this.pTxt(`Login Success!! User data Synching in progress`);
                setTimeout(() => this.redirectToHome(this.delay()),3000);
            },
            delay(){
                let qi = this.queue_index;
                return _(qi).map(i => parseInt(i) - __.now()).filter(i => i<this.maxHomeNavDelay).max() || 1;
            },
        },
        mounted(){
            this.$nextTick(() => this.checkLogin())
        },
        watch: {
            message(message){ if(_.isEmpty(message)) return; alert({ title:'Login Error',message,okButtonText:"Ok" }).then(() => this[set_state_data]({ message:'' })) },
            authenticated(status){ if(status === true) this.postFormLogin() },
        }
    }
</script>
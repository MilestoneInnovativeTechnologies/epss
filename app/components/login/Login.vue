<!--suppress ALL -->
<template>
    <App title="Login" :action="loginForm ? 'Login' : null" back="false" drawer="false" @login="authenticate" width="100%">
        <GridLayout rows="auto,auto,*" class="w-full">
            <Organization row="0"></Organization>
            <LoginForm row="1" width="85%" class="m-t-30" v-if="loginForm"></LoginForm>
            <StackLayout row="2" class="m-t-8 w-full">
                <ActivityIndicator :busy="busy" class="m-t-10"></ActivityIndicator>
                <TextHighlight class="w-full text-center" :text="pTexts[pTexts.length-1]" :key="'ull'+pTexts.length"></TextHighlight>
                <TextHighlight class="m-t-10 w-full text-center" :key="queueRemainingTime" v-if="waitNotification">{{ 'Kindly wait for '+queueRemainingTime+' secs' }}</TextHighlight>
            </StackLayout>
        </GridLayout>
    </App>
</template>

<script>
    import { mapGetters,mapActions,mapState,mapMutations } from 'vuex';
    import {set_state_data} from "../../assets/scripts/vuex/mutation-types";
    const imdQueueRemaining = require('./../../assets/scripts/mixins/immediatequeueremaining').ImmediateQueueRemainingTimeMixin;

    export default {
        name: 'Login',
        mixins: [imdQueueRemaining],
        data(){ return {
            busy: false,
            loginForm: false,
            pTexts: [],
            maxHomeNavDelay: 15,
            waitNotification: false,
        }},
        computed: {
            ...mapState('User',['message','validating','id']),
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
                setTimeout(() => this.$navigateTo(require('../Home').default,{ clearHistory:true }),after*1000);
            },
            populateUserData(data){
                console.log('POPULATE DATA: ',data);
                this.pTxt('User data found, populating..');
                let kData =_(data).keyBy('name').mapValues(({ detail }) => detail).value();
                this.pTxt('Doing post login actions..');
                // this.doLoginActions(kData).then(() => this.redirectToHome(this.delay()));
                this.doLoginActions(kData).then(() => this.waitNotification = true);
            },
            initLogin(){
                this.pTxt('No data found, try loging in using form..');
                this.loginForm = true; this.busy = false;
            },
            postFormLogin(data){
                this.busy = true; this.loginForm = false;
                this.pTxt(`Login Success!! User data Synching in progress`);
                this.waitNotification = true;
                //setTimeout(() => this.redirectToHome(this.delay()),3000);
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
            immediateQueueFinished(status){ if(status && this.authenticated) this.redirectToHome(2); }
        }
    }
</script>
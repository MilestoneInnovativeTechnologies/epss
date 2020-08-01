<!--suppress ALL -->
<template>
    <App title="Login" :action="loginForm ? 'Login' : null" back="false" drawer="false" @login="authenticate" width="100%">
        <GridLayout rows="auto,auto,*" class="w-full">
            <Organization row="0" />
            <LoginForm row="1" width="85%" class="m-t-30" v-if="loginForm" @credentials="credentials = $event" />
            <StackLayout row="2" class="m-t-8 w-full">
                <ActivityIndicator :busy="busy" class="m-t-10" />
                <TextHighlight class="w-full text-center" :text="pTexts[pTexts.length-1]" :key="'ull'+pTexts.length" />
                <TextHighlight class="m-t-20 w-full text-center" :key="percentage" v-if="waitNotification" :text="'Synchronizing records. Completed: '+percentage+'%'" />
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
            waitNotification: false,
            downloads: null,
            downloaded: 0,
            autoNavigate: null,
            autoNavigateDelay: 3000,
            credentials: { login: '', password: '' }
        }},
        computed: {
            ...mapState('User',['message','validating','id']), ...mapState('Connection',{ connection:'status' }),...mapState('Download',['batch']),
            authenticated(){ let id = this.id; return !(_.isNil(id)) },
            percentage() { return _.toSafeInteger(this.downloaded*100/_.toSafeInteger(this.downloads)); }
        },
        methods: {
            ...mapActions('User',['doLogin','doPostLoginActions']), ...mapMutations('User',[set_state_data]),
            pTxt(txt){ this.pTexts.push(txt) },
            authenticate(){
                if(!this.connection) return alert('No internet connection');
                this.pTxt('Authenticating with server....');
                this[set_state_data](this.credentials);
                this.doLogin();
            },
            checkLogin(){
                this.pTxt('Checking loging details in Database..'); this.busy = true;
                DB.get('epss_user',null,function(vm){
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
                this.autoNavigateDelay = 1000;
                this.pTxt('User data found, populating..');
                let kData =_(data).keyBy('name').mapValues(({ detail }) => detail).value();
                this.pTxt('Doing post login actions..');
                this.doPostLoginActions(kData).then(() => { this.waitNotification = true; if(!this.connection) this.redirectToHome(2); });
            },
            initLogin(){
                this.pTxt('No data found, try loging in using form..');
                this.loginForm = true; this.busy = false;
            },
            postFormLogin(data){
                this.busy = true; this.loginForm = false; this.autoNavigateDelay = 3000;
                this.pTxt(`Login Success!! User data Synching in progress`);
                this.waitNotification = true;
                this.autoNavigate = setTimeout(function(vm){ vm.redirectToHome(2) },this.autoNavigateDelay,this)
            }
        },
        mounted(){
            this.$nextTick(() => this.checkLogin());
        },
        watch: {
            message(message){ if(_.isEmpty(message)) return; alert({ title:'Login Error',message,okButtonText:"Ok" }).then(() => this[set_state_data]({ message:'' })) },
            authenticated(status){ if(status === true) this.postFormLogin() },
            batch: {
                deep:true,
                handler({ running }){
                    if(!this.waitNotification) return;
                    if(this.autoNavigate) { clearTimeout(this.autoNavigate); this.autoNavigate = null; }
                    if(this.downloads === null || running.length > this.downloads) {
                        if(running.length === 0) this.redirectToHome(2);
                        this.downloads = running.length;
                    } else {
                        if(this.downloaded < this.downloads) this.downloaded++;
                        if(this.downloaded >= this.downloads) this.redirectToHome(2);
                    }
                }
            }
        }
    }
</script>
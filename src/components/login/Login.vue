<template>
    <App title="Login" :action="id ? null : 'Login'" back="false" drawer="false" @login="authenticate" width="100%">
        <GridLayout rows="auto,auto,*" class="w-full">
            <Organization row="0" />
            <LoginForm row="1" width="85%" class="m-t-30" v-if="!id" @credentials="credentials = $event" />
            <StackLayout row="2" class="m-t-8 w-full">
                <ActivityIndicator :busy="busy || !!id" class="m-t-10" />
                <TextHighlight class="w-full text-center" :text="progress" />
                <TextHighlight class="m-t-20 w-full text-center" v-if="!!id && sync.downloadableTables.length" :text="'Synchronizing records. Completed: '+percentage+'%'" :completed="completed" />
            </StackLayout>
        </GridLayout>
    </App>
</template>

<script>
    import { mapGetters,mapActions,mapState,mapMutations } from 'vuex';
    import {
        add_event_subscriber,
        remove_event_subscriber,
        set_state_data
    } from "../../assets/scripts/vuex/mutation-types";
    const events = ['batchDownloadStarting','batchDownloadedTable']
	const timer = require('@nativescript/core/timer');
    export default {
        name: 'Login',
        data(){ return {
            busy: false, syncing: false,
            progress: '',
            credentials: { login: '', password: '' }
        }},
        computed: {
            ...mapState('User',['message','validating','id','sync']), ...mapState('Connection',{ connection:'status' }),
            percentage() { return _.toSafeInteger(this.sync.downloadedTables.length*100/this.sync.downloadableTables.length); },
            completed(){ return (this.percentage === 100) ? this.goHome(5) : this.percentage },
        },
        methods: {
            ...mapActions('User',['doLogin','doPostLoginActions']),
            ...mapMutations('User',{ setStateData:set_state_data,initSync:'initSync' }),
            ...mapMutations([add_event_subscriber,remove_event_subscriber]),
            pTxt(txt){ return this.progress = txt },
            authenticate(){
                if(!this.connection) return alert('No internet connection');
                this.pTxt('Authenticating with server....');
                this.setStateData(this.credentials);
                this.doLogin();
            },
            checkLogin(){
                this.pTxt('Checking login details in Database..'); this.busy = true;
                DB.get('epss_user',null,function(vm){
                    if(this.error) return timer.setTimeout((vm) => vm.$navigateTo(require('../misc/Setup').default,{ backstackVisible:false }),500,vm);
                    if(_.isEmpty(this.result)) return vm.initLogin();
                    vm.populateUserData(this.result)
                },this)
            },
            goHome(retry){
                if(retry === undefined) retry = 0;
                if(this.id) this.pTxt(`Login Success!! User data Synchronizing in progress`);
                if(this.percentage > 0 && this.percentage < 100) return;
                if(retry < 5) return timer.setTimeout(this.goHome,1250,retry+1);
                this.pTxt(`Loading main page..`);
                timer.setTimeout(vm => vm.$navigateTo(require('../Home').default,{ clearHistory:true }),1000,this);
            },
            populateUserData(data){
                this.pTxt('Logging in...');
                let kData =_(data).keyBy('name').mapValues(({ detail }) => detail).value();
                this.doPostLoginActions(kData).then(() => this.goHome(this.connection ? 0 : 5));
            },
            initLogin(){
                this.pTxt('No data found, try login in using form..');
                this.initSync(); this.busy = false;
            }
        },
        mounted(){
            events.forEach(event => this[add_event_subscriber]({ event,module:'User' }))
            this.$nextTick(() => this.checkLogin());
        },
        watch: {
            message(message){ if(_.isEmpty(message)) return; alert({ title:'Login Error',message,okButtonText:"Ok" }).then(() => this[set_state_data]({message: this.pTxt('')})) },
            id(uid){ if(uid) this.goHome(0) }
        },
        beforeDestroy(){
            events.forEach(event => this[remove_event_subscriber]({ event,module:'User' }))
        }
    }
</script>
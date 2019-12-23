<template>
    <App title="Setup Application" action="Setup Application" drawer="false" back="false" :actionProps="{ isEnabled:!busy }" @setup-application="doSetup">
        <TextHeadingSub class="m-t-30">Device UUID</TextHeadingSub>
        <TextField class="cp fsi" v-model="uuid" />
        <TextRegular :textWrap="true">Provide this UUID to Milestone to get your device registered for using ePlus Smart Sale</TextRegular>
        <TextRegular :textWrap="true" class="m-t-20">Once your device registered, please proceed to Setup Application</TextRegular>
        <ActivityIndicator :busy="busy" class="m-t-20"></ActivityIndicator>
        <StackLayout v-if="busy" class="m-t-20">
            <TextHighlight class="m-t-20 w-full text-center" :text="'Downloading records. Completed: '+percentage+'%'" v-if="tasks['Init synchronizing app records']"></TextHighlight>
            <TextHeadingSub>Tasks</TextHeadingSub>
            <GridLayout coloums="*,auto" :rows="taskRows">
                <template v-for="(status,task,idx) in tasks">
                    <FontIcon class="cp m-t-2" size="16" :row="idx" col="0" :name="status ? 'check_box' : 'check_box_outline_blank'"></FontIcon>
                    <TextHighlight class="m-l-20" :row="idx" col="1">{{ task }}</TextHighlight>
                </template>
            </GridLayout>
        </StackLayout>
        <StackLayout v-if="dwnTblsRows">
            <TextHeadingSub>Tables</TextHeadingSub>
            <WrapLayout>
                <StackLayout v-for="(status,table) in dwnTables" orientation="horizontal" :key="'dwn-table-'+table">
                    <TextHighlight>{{ table | properCase }}</TextHighlight>
                    <FontIcon class="cp m-t-2 m-r-20" size="16" :name="status ? 'check_box' : 'check_box_outline_blank'"></FontIcon>
                </StackLayout>
            </WrapLayout>
        </StackLayout>
    </App>
</template>

<script>
    import {set_state_data,remove_event_subscriber} from "../../assets/scripts/vuex/mutation-types";
    const { device, screen } = require('tns-core-modules/platform');
    import { mapActions,mapState,mapMutations } from 'vuex';
    import {WideScreenCheck} from "../../assets/scripts/mixins/widescreencheck";
    const Login = require('../login/Login').default

    export default {
        name: "Setup",
        mixins: [WideScreenCheck],
        data(){ return {
            busy: false,
            uuid: device.uuid,
            downloads: null,
            completed: 0
        }},
        computed: {
            ...mapState('App',['message','tasks','dwnTables']),...mapState('Download',['batch']),
            taskRows(){ return _.fill(Array(_.size(this.tasks)),'auto').join(','); },
            dwnTblsRows(){ return _.isEmpty(this.dwnTables) ? false : Array(_.keys(this.dwnTables).length).fill('auto').join(','); },
            taskStatus(){ let tasks = this.tasks; return _.every(tasks) },
            regData(){ return { uuid:this.uuid,height:screen.mainScreen.heightDIPs,width:screen.mainScreen.widthDIPs,print_width:this.WSC_isWide ? 48 : 32 } },
            percentage(){ return _.toSafeInteger(this.completed*100/_.toSafeInteger(this.downloads)) }
        },
        methods: {
            ...mapActions({register:'App/register',sLog:'App/sLog',rootInit:'init'}),
            ...mapMutations({ setStateData:'App/'+set_state_data, remEventSub:remove_event_subscriber }),
            doSetup(){ this.busy = true; this.register(this.regData); },
            removeEvents(){
                ['batchDownloadStarting','batchDownloadedTable']
                .forEach(event => this.remEventSub({ event,module:'App' }));
            },
            completeSetup(){
                this.removeEvents(); this.sLog('Completed!');
                this.rootInit(_.cloneDeep(VuexStore._modulesNamespaceMap));
            }
        },
        filters: {
            properCase(value) { return _.startCase(value); }
        },
        watch: {
            message:function(val){ if(_.isEmpty(val)) return; alert({ title:'Setup Error', message:val, okButtonText:'Ok' }).then(() => { this.busy = false; this.setStateData({ message:'' })}) },
            taskStatus:function(val){ if(val) this.$navigateTo(Login,{ backstackVisible:false }); },
            dwnTables:{
                deep:true,
                handler(tables){
                    if(!tables || _.isEmpty(tables)) return;
                    if(this.downloads === null){
                        if(!this.tasks['Init synchronizing app records']) return;
                        else this.downloads = _.keys(tables).length;
                    } else {
                        this.completed = _.filter(tables).length
                        if(this.completed >= this.downloads) this.completeSetup();
                    }
                }
            }
        }
    }
</script>
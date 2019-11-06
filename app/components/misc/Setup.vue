<!--suppress ALL -->
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
    </App>
</template>

<script>
    import {set_state_data,remove_event_subscriber} from "../../assets/scripts/vuex/mutation-types";
    const { device, screen } = require('tns-core-modules/platform');
    import { mapActions,mapState,mapMutations } from 'vuex';
    const Login = require('../login/Login').default

    export default {
        name: "Setup",
        data(){ return {
            busy: false,
            uuid: device.uuid,
            downloads: null,
            completed: 0
        }},
        computed: {
            ...mapState('App',['message','tasks']),...mapState('Download',['batch']),
            taskRows(){ return _.fill(Array(_.size(this.tasks)),'auto').join(','); },
            taskStatus(){ let tasks = this.tasks; return _.every(tasks) },
            regData(){ return { uuid:this.uuid,height:screen.mainScreen.heightDIPs,width:screen.mainScreen.widthDIPs } },
            percentage(){ return _.toSafeInteger(this.completed*100/_.toSafeInteger(this.downloads)) }
        },
        methods: {
            ...mapActions({register:'App/register',sLog:'App/sLog',distribute:'Menu/distribute',rootInit:'init'}),
            ...mapMutations({ setStateData:'App/'+set_state_data, remEventSub:remove_event_subscriber }),
            doSetup(){ this.busy = true; this.register(this.regData); },
            completeSetup(){
                this.remEventSub({ event:'batchDownloadStarting',module:'App' });
                this.distribute(); this.sLog('Completed!'); this.rootInit(_.cloneDeep(VuexStore._modulesNamespaceMap))
            }
        },
        watch: {
            message:function(val){ if(_.isEmpty(val)) return; alert({ title:'Setup Error', message:val, okButtonText:'Ok' }).then(() => { this.busy = false; this.setStateData({ message:'' })}) },
            taskStatus:function(val){ if(val) this.$navigateTo(Login,{ backstackVisible:false }); },
            batch:{
                deep:true,
                handler({ running }){
                    if(this.downloads === null){
                        if(!this.tasks['Init synchronizing app records']) return;
                        if(running.length === 0) this.completeSetup();
                        else this.downloads = running.length;
                    } else {
                        this.completed++;
                        if(this.completed >= this.downloads) this.completeSetup();
                    }
                }
            },
        }
    }
</script>
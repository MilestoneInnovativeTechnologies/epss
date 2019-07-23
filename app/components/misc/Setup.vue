<!--suppress ALL -->
<template>
    <App title="Setup Application" action="Setup Application" drawer="false" back="false" :actionProps="{ isEnabled:!busy }" @setup-application="doSetup">
        <TextHeadingSub class="m-t-30">Device UUID</TextHeadingSub>
        <TextField class="cp fsi" v-model="uuid" />
        <TextRegular :textWrap="true">Provide this UUID to Milestone to get your device registered for using ePlus Smart Sale</TextRegular>
        <TextRegular :textWrap="true" class="m-t-20">Once your device registered, please proceed to Setup Application</TextRegular>
        <ActivityIndicator :busy="busy" class="m-t-30"></ActivityIndicator>
        <StackLayout v-if="busy" style="margin-top: 50; width: 70%">
            <TextHeadingSub>Tasks</TextHeadingSub>
            <GridLayout coloums="*,auto" :rows="taskRows">
                <template v-for="(status,task,idx) in tasks">
                    <FontIcon class="cp m-t-2" size="16" :row="idx" col="0" :name="status ? 'check_box' : 'check_box_outline_blank'"></FontIcon>
                    <TextHighlight class="m-l-20" :row="idx" col="1">{{ task }}</TextHighlight>
                </template>
            </GridLayout>
            <TextHighlight class="m-t-20 w-full text-center" :key="queueRemainingTime" v-if="queueRemainingTime !== 0">{{ queueRemainingTime > 0 ? ('Kindly wait for '+queueRemainingTime+' secs') : ('Please wait, Seems slow internet connection ('+queueRemainingTime+')') }}</TextHighlight>
        </StackLayout>
    </App>
</template>

<script>
    import {set_state_data} from "../../assets/scripts/vuex/mutation-types";
    const { device, screen } = require('tns-core-modules/platform');
    import { mapActions,mapState,mapMutations } from 'vuex';
    const Login = require('../login/Login').default
    const imdQueueRemaining = require('./../../assets/scripts/mixins/immediatequeueremaining').ImmediateQueueRemainingTimeMixin;

    export default {
        name: "Setup",
        mixins: [imdQueueRemaining],
        data(){ return {
            busy: false,
            uuid: device.uuid,
        }},
        computed: {
            ...mapState('App',['message','tasks']),
            taskRows(){ return _.fill(Array(_.size(this.tasks)),'auto').join(','); },
            taskStatus(){ let tasks = this.tasks; return _.every(tasks) },
            regData(){ return { uuid:this.uuid,height:screen.mainScreen.heightDIPs,width:screen.mainScreen.widthDIPs } },
        },
        methods: {
            ...mapActions('App',['register','sLog']), ...mapMutations('App',{ setStateData:set_state_data }),
            doSetup(){ this.busy = true; this.register(this.regData); },
            getRemaining(queue){ return _.reduce(queue,(prev,next) => ((tInt(next) - tInt(prev)) > gap_between_sync_queue_seconds) ? tInt(prev) : tInt(next),queue[0]) - parseInt(new Date().getTime() / 1000) }
        },
        watch: {
            message:function(val){ if(_.isEmpty(val)) return; alert({ title:'Setup Error', message:val, okButtonText:'Ok' }).then(() => { this.busy = false; this.setStateData({ message:'' })}) },
            taskStatus:function(val){ if(val) this.$navigateTo(Login,{ backstackVisible:false }); },
            immediateQueueFinished:function(status){ if(status) this.sLog('Synchronize tables'); }
        }
    }
</script>
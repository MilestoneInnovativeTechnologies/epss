<template>
    <App title="Setup Application" action="Setup Application" drawer="false" back="false" :actionProps="{ isEnabled:!busy }" @setup-application="doSetup">
        <TextHeadingSub class="m-t-30" text="Device UUID" />
        <TextField class="cp fsi" v-model="uuid" />
        <TextRegular :textWrap="true" text="Provide this UUID to Milestone to get your device registered for using ePlus Smart Sale" />
        <TextRegular :textWrap="true" class="m-t-20" text="Once your device registered, please proceed to Setup Application" />
        <ActivityIndicator :busy="busy" class="m-t-20" />
        <StackLayout v-if="busy" class="m-t-20">
            <TextHighlight class="m-t-20 w-full text-center" :text="'Downloading records. Completed: '+percentage+'%'" v-if="downloadableTables.length" />
            <TextHighlight class="w-full text-center" text="Completing Setup, Please hold a moment.." v-if="completed" />
            <TextHeadingSub text="Tasks" />
            <GridLayout coloums="*,auto" :rows="taskRows">
                <template v-for="(task,idx) in tasks">
                    <FontIcon class="cp" size="16" :row="idx" col="0" :name="isTaskCompleted(task) ? 'check_box' : 'check_box_outline_blank'" />
                    <TextHighlight class="m-l-20" :row="idx" col="1" :text="task" />
                </template>
            </GridLayout>
        </StackLayout>
        <StackLayout v-if="downloadableTables.length">
            <TextHeadingSub text="Tables" />
            <WrapLayout>
                <StackLayout v-for="table in downloadableTables" orientation="horizontal" :key="'dwn-table-'+table">
                    <FontIcon class="cp m-r-4" size="16" :name="isTableDownloaded(table) ? 'check_box' : 'check_box_outline_blank'" />
                    <TextHighlight class="m-r-16">{{ table | properCase }}</TextHighlight>
                </StackLayout>
            </WrapLayout>
        </StackLayout>
    </App>
</template>

<script>
    import {set_state_data,remove_event_subscriber} from "../../assets/scripts/vuex/mutation-types";
    const { device, screen } = require('@nativescript/core/platform');
    import { mapActions,mapState,mapMutations } from 'vuex';
    import {WideScreenCheck} from "../../assets/scripts/mixins/widescreencheck";
    import {wide_screen_minimum_width} from "../../assets/scripts/constants";
    const Login = require('../login/Login').default;
    const timer = require('@nativescript/core/timer');

    export default {
        name: "Setup",
        mixins: [WideScreenCheck],
        data(){ return {
            busy: false,
            uuid: device.uuid,
        }},
        computed: {
            ...mapState('App',['message','tasks','cTasks','downloadableTables','downloadedTables']),
            taskRows(){ return _.fill(Array(_.size(this.tasks)),'auto').join(','); },
            regData(){ return { uuid:this.uuid,height:screen.mainScreen.heightDIPs,width:screen.mainScreen.widthDIPs,print_width:(screen.mainScreen.widthDIPs > wide_screen_minimum_width) ? 48 : 32 } },
            percentage(){ return _.toSafeInteger(this.downloadedTables.length*100/_.toSafeInteger(this.downloadableTables.length)) },
            completed(){ return this.downloadableTables.length && (this.downloadableTables.length === this.downloadedTables.length) }
        },
        methods: {
            ...mapActions({register:'App/register',sLog:'App/sLog',rootInit:'init'}),
            ...mapMutations({ setStateData:'App/'+set_state_data, remEventSub:remove_event_subscriber,taskCompleted:'App/taskCompleted' }),
            doSetup(){ this.busy = true; this.register(this.regData); },
            isTaskCompleted(task){ return _.includes(this.cTasks,task) },
            isTableDownloaded(tbl){ return _.includes(this.downloadedTables,tbl) }
        },
        filters: {
            properCase(value) { return _.startCase(value); }
        },
        watch: {
            message:function(val){ if(_.isEmpty(val)) return; alert({ title:'Setup Error', message:val, okButtonText:'Ok' }).then(() => { this.busy = false; this.setStateData({ message:'' })}) },
            completed:function(val){
                if(!val) return;
                this.taskCompleted('Completed!');
                ['batchDownloadStarting','batchDownloadedTable'].forEach(event => this.remEventSub({ event,module:'App' }));
                this.rootInit(_.cloneDeep(this.$store._modulesNamespaceMap));
                timer.setTimeout(($vm,comp) => $vm.$navigateTo(comp,{ backstackVisible:false }),2000,this,Login)
            }
        }
    }
</script>

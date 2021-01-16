<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <StackLayout :key="'time-'+now">
            <StackLayout style="padding-left: 30; padding-right: 30">
                <AppInfoWide :text="status ? 'Online' : 'Offline'" title="Connection" />
                <AppInfoWide :text="processing" title="Processing ID" />
                <AppInfoWide :text="init_time" title="Start Time" />
                <AppInfoWide :text="now" title="Now" />
                <AppInfoWide :text="latest" title="Latest ID" />
                <AppInfoWide :text="completed" title="Completed ID" />
                <AppInfoWide :text="source.length" title="Total Pending" />
            </StackLayout>
            <AppButton @tap.native="reload" text="RELOAD" height="50" />
            <StackLayout v-for="item in source" :key="now + '-pu-' + item.id"  style="padding-left: 10; padding-right: 10;">
                <GridLayout rows="auto" columns="3*,2*,*,*">
                    <Label :text="item.table" row="0" col="0" />
                    <Label :text="item.status" row="0" col="1" />
                    <StackLayout @tap="download(item)" row="0" col="2"><FontIcon name="get_app" /></StackLayout>
                    <StackLayout @tap="reSubmit(item)" row="0" col="3"><FontIcon name="cached" v-if="status" /></StackLayout>
                </GridLayout>
            </StackLayout>
        </StackLayout>
    </Page>
</template>

<script>
    import {mapState} from "vuex";
    import FontIcon from "../fonticon/FontIcon";

    const permission = require('nativescript-permissions')
    const timer = require('@nativescript/core/timer')
    import { File,path } from '@nativescript/core/file-system'
    import {StoragePermission} from "../../assets/scripts/mixins/storagepermission";

    const progress = ['ADDED','CONSIDERED','RESPONDED'],
        layout = { Table:'table',Progress:'progress',Status:'status',Added:'added',Considered:'considered',Responded:'responded' };

    export default {
        name: "DebugSix",
        mixins: [StoragePermission],
        data(){ return {
            records: [], progress, layout, now: __.now()
        } },
        computed: {
            ...mapState('Upload',['processing','init_time','latest','completed','retry_count','uData','enums','reset']),
            ...mapState('Connection',['status']),
            source(){ return this.records.map(this.recordSource) },
        },
        methods: {
            recordSource({ id,url,status,content }){
                return {
                    table: _.split(url,'/').pop(),
                    status: _(this.enums).omit(this.progress).invert().value()[status],
                    content, id
                }
            },
            async download({ content,table }){
                if(!await this.StoragePermission()) return;
                let fileName = [__.datez(),__.time(),table,'json'].join('.'), destination = path.join(android.os.Environment.getExternalStorageDirectory().getAbsolutePath().toString(),'epss',fileName);
                File.fromPath(content).readText().then(txt => File.fromPath(destination).writeText(txt).then(() => alert('Successfully saved file!!')).catch(() => alert('Saving file failed!!'))).catch(() => alert('Reading file failed!!'))
            },
            reSubmit({ id }){ this.$store.dispatch('Upload/reset',id,{ root:true }).then(() => timer.setTimeout(this.reload,250)) },
            reload(){
                DB.get('epss_sync',{ status:this.enums.SUCCESS,operator:'<>' }).then(records => { this.records = records; this.now = __.now() });
            }
        },
        created(){ this.reload() }
    };
</script>

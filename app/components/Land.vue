<!--suppress ALL -->
<template>
    <Page>
        <ActionBar title="ePlus Smart Sale"></ActionBar>
        <ScrollView>
            <GridLayout width="100%" rows="auto,*,50">
                <Organization row="0"></Organization>
                <Login row="1"></Login>
                <Label row="2" textWrap="true" class="t-12 fsi font-italic text-center" style="width: 90%;" :text="pick" />
            </GridLayout>
        </ScrollView>
    </Page>
</template>

<script>
    import { mapGetters,mapState } from 'vuex';
    export default {
        name: 'Land',
        computed: {
            ...mapGetters('Log', ['pick']),
            ...mapState('Organization', { OrgImg:'image',OrgName:'name',OrgBrief:'brief',OrgUUID:'uuid' }),
            ...mapState('Sync', { SyncTable:'tables',SyncQueue:'queue',SyncQueueIndex:'queue_index',SyncStartAfter:'app_sync_start_after',SyncRepeatFailedProcSec:'repeat_failed_processing_seconds',SyncProcessing:'processing',SyncURL:'url',SyncTime:'time',SyncRepeatTO:'repeat_failed_timeout',SyncTimeout:'time_out'}),
            ...mapState('Axios',{ AxiosProcessing:'processing',AxiosTransfer:'transfer',AxiosTransfer:'transfer',AxiosStatus:'status',AxiosSuccess:'success',AxiosFail:'fail' }),
        }
    }
</script>

<style scoped>
    ActionBar {
        background-color: #FFA656;
        color: #000000;
        font-weight: bold;
    }

    .title {
        text-align: left;
        padding-left: 16;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }

    .drawer-header {
        padding: 50 16 16 16;
        margin-bottom: 16;
        background-color: #53ba82;
        color: #ffffff;
        font-size: 24;
    }

    .drawer-item {
        padding: 8 16;
        color: #333333;
        font-size: 16;
    }

</style>

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
            ...mapState('Axios',{ AxiosProcessing:'processing',AxiosTransfer:'transfer',AxiosTransfer:'transfer',AxiosStatus:'status',AxiosSuccess:'success',AxiosFail:'fail',AxiosQueue:'queue',AxiosLastResp:'last_response' }),
        },
        methods: {
            huo(){
                //DB.insert('areas',{ name:'TEST' });
                DB.create('abc','name,text')
            }
        }
    }
</script>
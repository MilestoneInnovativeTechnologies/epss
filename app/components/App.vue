<!--suppress ALL -->
<template>
    <Page>
        <CustomActionBar title="ePlus Smart Sale"></CustomActionBar>
        <GridLayout width="100%" rows="auto,*,50">
            <Organization row="0"></Organization>
            <Login row="1"></Login>
            <Label row="2" textWrap="true" class="t-12 fsi font-italic text-center" style="width: 90%;" :text="pick" />
        </GridLayout>
    </Page>
</template>

<script>
    import { mapGetters,mapState } from 'vuex';
    import CustomActionBar from "./CustomActionBar";
    import Organization from "./Organization";
    import Login from "./Login";
    export default {
        name: 'App',
        components:{ Organization,Login,CustomActionBar },
        computed: {
            ...mapGetters('Log', ['pick']),
            ...mapState('Organization', ['image','name','brief','uuid']),
            ...mapState('Axios', ['client','last_response']),
            ...mapState('Axios', { axiosQueue: 'queue',axiosProcessing: 'processing',axiosConnection: 'connection',axiosTransfer: 'transfer' }),
            ...mapState('Sync', ['tables','time']),
            ...mapState('Sync', { syncQueueIndex:'queue_index',syncQueueProcessing:'processing',syncQueue:'queue' }),
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

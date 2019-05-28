<!--suppress ALL -->
<template>
    <Page>
        <ActionBar>
            <GridLayout width="100%" columns="auto">
                <Label style="" class="fsb fs22" text="ePlus Smart Sale" col="0"/>
            </GridLayout>
        </ActionBar>
        <GridLayout width="100%" rows="*,50">
            <StackLayout row="0">
                <GridLayout v-show="!!name" width="100%" rows="50,6,auto,6">
                    <StackLayout row="0"></StackLayout>
                    <StackLayout row="1" class="" style="background: linear-gradient(to top, #E1E1E1, #FFFFFF); width: 100%;"></StackLayout>
                    <StackLayout row="2" class="p-y-20">
                        <Image :src="image" height="128" />
                        <Label :text="name" class="text-center cp m-y-15 fsb fs22" style="width: 100%" />
                        <Label :text="brief" textWrap="true" class="font-weight-bold text-center font-italic fsi t-12" style="width: 70%" />
                    </StackLayout>
                    <StackLayout row="4" class="" style="background: linear-gradient(to bottom, #E1E1E1, #FFFFFF); width: 100%;"></StackLayout>
                </GridLayout>
            </StackLayout>
            <Label class="message" style="width: 90%; margin-left: 5%; font-size: 20;" :text="pick || msg" row="1" />
        </GridLayout>

    </Page>
</template>

<script>
    import { mapGetters,mapState } from 'vuex';
    export default {
        name: 'App',
        data(){ return {
            msg: 'ePlus Smart Sale'
        }},
        computed: {
            ...mapGetters('Log', ['pick']),
            ...mapState('Organization', ['image','name','brief','uuid']),
            ...mapState('Axios', ['client','queue','last_response']),
            ...mapState('Axios', { axiosQueue: 'queue',axiosProcessing: 'processing',axiosConnection: 'connection' }),
            ...mapState('Sync', ['app_tables','time']),
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

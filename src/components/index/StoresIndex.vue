<template>
    <App title="Stores">
        <ReSyncButton @resync="sStores" label="Sync Stores" v-show="!batch.length" />
        <AppList v-if="stores" title="Stores" class="m-b-20" :source="stores" :layout="{ Code:'code',Name:'name','Currency':'currency' }" />
        <ReSyncButton @resync="sAreas" label="Sync Areas" v-show="!batch.length" />
        <AppList v-if="areas" title="Areas" :source="areas" :layout="{ Name:'name' }" />
    </App>
</template>

<script>
    import {login_user_assigned_areas, login_user_assigned_stores} from "../../assets/scripts/queries";
    import ReSyncButton from "../content/ReSyncButton";

    export default {
        name: "StoresIndex",
        components: {ReSyncButton},
        computed: {
            stores(){ return this.$store.state['Stores'].list },
            areas(){ return this.$store.state['Areas'].list },
            batch(){ return this.$store.getters['Download/pending'] },
        },
        methods: {
            sAreas(){ this.$store.dispatch('Download/tables',['areas'],{ root:true }) },
            sStores(){ this.$store.dispatch('Download/tables',['stores'],{ root:true }) },
        },
        created(){
            this.$store.dispatch('Stores/_stockIfNot',{ query:login_user_assigned_stores,key:'list' },{ root:true });
            this.$store.dispatch('Areas/_stockIfNot',{ query:login_user_assigned_areas,key:'list' },{ root:true });
        }
    }
</script>
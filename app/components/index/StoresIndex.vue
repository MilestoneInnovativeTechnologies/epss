<template>
    <App title="Stores">
        <AppList v-if="stores" title="Stores" class="m-b-20" :source="stores" :layout="{ Code:'code',Name:'name','Currency':'currency' }" />
        <AppList v-if="areas" title="Areas" :source="areas" :layout="{ Name:'name' }" />
    </App>
</template>

<script>
    import {login_user_assigned_areas, login_user_assigned_stores} from "../../assets/scripts/queries";

    export default {
        name: "StoresIndex",
        computed: {
            stores(){ return this.$store.state['Stores'].list },
            areas(){ return this.$store.state['Areas'].list },
        },
        created(){
            this.$store.dispatch('Stores/_stockIfNot',{ query:login_user_assigned_stores,key:'list' },{ root:true });
            this.$store.dispatch('Areas/_stockIfNot',{ query:login_user_assigned_areas,key:'list' },{ root:true });
        }
    }
</script>
<template>
    <App title="Customers">
        <AppForm :fields="{ search:{ name:'search',type:'Text',label:'' } }" @search="search = $event" />
        <ReSyncButton @resync="resync" v-show="!batch.length" />
        <CustomerList v-if="CCacheDataReady" :customers="customers" />
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../assets/scripts/mixins/ccachedata";
    import ReSyncButton from "../content/ReSyncButton";
    const item = 'users'

    export default {
        name: "CustomersIndex",
        components: {ReSyncButton},
        props: ['id'],
        mixins: [CCacheDataMixin],
        data(){ return { search:'' } },
        computed: {
            customers(){ return (_.trim(this.search) === '') ? this.users : this.users.filter(this.isIn) },
            batch(){ return this.$store.getters['Download/pending'] },
        },
        methods: {
            isIn({ name,code,email }){ return _.toLower(name+code+email).includes(_.toLower(_.trim(this.search))); },
            resync(){ this.$store.dispatch('Download/tables',[item],{ root:true }); this.CCacheDataPrepare(item) }
        },
        created(){ this.CCacheDataPrepare(item); }
    }
</script>
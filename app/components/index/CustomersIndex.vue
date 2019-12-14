<template>
    <App title="Customers">
        <AppForm :fields="{ search:{ name:'search',type:'Text',label:'' } }" @search="search = $event" />
        <CustomerList v-if="CCacheDataReady" :customers="customers" />
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../assets/scripts/mixins/ccachedata";

    export default {
        name: "CustomersIndex",
        props: ['id'],
        mixins: [CCacheDataMixin],
        data(){ return { search:'' } },
        computed: {
            customers(){ return (_.trim(this.search) === '') ? this.users : this.users.filter(this.isIn) }
        },
        methods: {
            isIn({ name,code,email }){ return _.toLower(name+code+email).includes(_.toLower(_.trim(this.search))); }
        },
        created(){ this.CCacheDataPrepare('users'); }
    }
</script>
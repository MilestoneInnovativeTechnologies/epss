<template>
    <App title="Customer Detail">
        <TextTitle>{{ customer.name }}</TextTitle>
        <TextTitleSub>{{ customer.code }}</TextTitleSub>
        <AppInfoWide title="Phone" v-if="customer.phone">{{ customer.phone }}</AppInfoWide>
        <AppInfoWide title="Email" v-if="customer.email">{{ customer.email }}</AppInfoWide>
        <CustomerOutstandingMetric :id="id" class="m-t-15"></CustomerOutstandingMetric>
    </App>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "CustomerDetail",
        props: ['id'],
        data(){ return {

        } },
        computed:{
            ...mapGetters('Customer',['_tableDataItem']),
            customer(){ return this._tableDataItem('users',this.id) },
        },
        methods: {

        },
    }
</script>
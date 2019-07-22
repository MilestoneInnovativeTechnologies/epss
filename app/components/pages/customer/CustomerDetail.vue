<template>
    <App title="Customer Detail">
        <TextTitle>{{ customer.name }}</TextTitle>
        <TextTitleSub>{{ customer.code }}</TextTitleSub>
        <AppInfoWide title="Phone" v-if="customer.phone">{{ customer.phone }}</AppInfoWide>
        <AppInfoWide title="Email" v-if="customer.email">{{ customer.email }}</AppInfoWide>
        <AppInfoWide title="Address" v-if="customer.address">{{ customer.address }}</AppInfoWide>
        <CustomerOutstandingMetric :id="id" class="m-t-15"></CustomerOutstandingMetric>
        <CustomerRecentSaleList :id="id" :limit="3" class="m-t-15" title="Recent Sales"></CustomerRecentSaleList>
        <CustomerRecentReturnList :id="id" :limit="3" class="m-t-15" title="Recent Returns"></CustomerRecentReturnList>
        <CustomerRecentReceipts :id="id" :limit="4" class="m-t-15" title="Recent Receipts"></CustomerRecentReceipts>
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
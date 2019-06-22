<template>
    <RecentTransactionList trType="SL" title="Recent Sales" :path="path" :fields="fields" :condition="condition" :limit="limit" :layout="layout" :cast="cast" :links="{ customer:['customer/CustomerDetail',{ id:'cid' }] }" detail="sales/SaleDetail"></RecentTransactionList>
</template>

<script>
    export default {
        name: "ProductRecentSalesList",
        props: ['id','limit'],
        data(){ return {
            layoutTemplate:['docno','customer','date','quantity'],
            fields: ['id','docno','cid','customer','date','quantity'],
            cast:{ date:'docdate',quantity:'quantity' }
        }},
        computed: {
            layout(){ return _.mapKeys(this.layoutTemplate,(item) => _.capitalize(item))},
            path(){ return 'PR' + this.id },
            condition(){ return _.zipObject(['pid'],[this.id]) }
        }
    }
</script>
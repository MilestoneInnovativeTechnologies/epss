<template>
    <RecentTransactionList trType="SR" title="Recent Sales Returns" :path="path" :fields="fields" :condition="condition" :limit="limit" :layout="layout" :cast="cast" :links="{ customer:['customer/CustomerDetail',{ id:'cid' }] }" detail="sales/SaleReturnDetail"></RecentTransactionList>
</template>

<script>
    export default {
        name: "ProductRecentReturnsList",
        props: ['id','limit'],
        data(){ return {
            fields: ['id','docno','cid','customer','date','quantity','nature'],
            layoutTemplate:['docno','customer','date','quantity','nature'],
            cast:{ date:'docdate',quantity:'quantity' },
        }},
        computed: {
            path(){ return 'PS' + this.id },
            condition(){ return _.zipObject(['pid'],[this.id]) },
            layout(){ return _.mapKeys(this.layoutTemplate,(item) => _.capitalize(item))},
        }
    }
</script>
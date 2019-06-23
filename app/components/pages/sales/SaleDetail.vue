<template>
    <App title="Sale Detail">
        <TransactionDetail trType="SL" :id="id" :fields="fields" :layout="layout" :cast="cast"></TransactionDetail>
    </App>
</template>

<script>
    export default {
        name: "SaleDetail",
        props: ['id'],
        data(){ return {
            fields: [ 'docno','date','customer','executive','total','tax','discount','product','quantity','price','pid' ],
            layoutValues: [ 'product','quantity','price','tax','discount','total' ],
            cast: { quantity:'quantity',price:'rate',discount:'amount',total:'amount',tax:'rate' },
        }},
        computed: {
            layout(){ return _.mapKeys(this.layoutValues,(item) => _.capitalize(item)) },
        }
    }
</script>
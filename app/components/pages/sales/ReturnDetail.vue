<template>
    <App title="Sales Return Details">
        <TransactionDetail trType="SR" :id="id" :fields="fields" :layout="layout" :cast="cast"></TransactionDetail>
    </App>
</template>

<script>
    export default {
        name: "ReturnDetail",
        props: ['id'],
        data(){ return {
            fields: [ 'docno','date','customer','executive','total','tax','discount','product','quantity','amount','nature','pid' ],
            layoutValues: [ 'product','quantity','amount','nature','tax','discount','total' ],
            cast: { quantity:'quantity',amount:'rate',discount:'amount',total:'amount',tax:'rate' },
        }},
        computed: {
            layout(){ return _.mapKeys(this.layoutValues,(item) => _.capitalize(item)) },
        }

    }
</script>
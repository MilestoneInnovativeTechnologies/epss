<template>
    <App title="Sale Detail" action="Print Preview" @print-preview="$navigateTo(preview,{ props: { id }})">
        <TransactionDetail trType="SL" :id="id" :fields="fields" :layout="layout" :cast="cast"></TransactionDetail>
    </App>
</template>

<script>
    export default {
        name: "SaleDetail",
        props: ['id'],
        data(){ return {
            fields: [ 'docno','date','customer','executive','total','tax','discount','product','quantity','amount','pid' ],
            layoutValues: [ 'product','quantity','amount','tax','discount','total' ],
            cast: { quantity:'quantity',amount:'rate',discount:'amount',total:'amount',tax:'rate' },
        }},
        computed: {
            layout(){ return _.mapKeys(this.layoutValues,(item) => _.capitalize(item)) },
            preview(){ return require('./SalePreview').default }
        }
    }
</script>
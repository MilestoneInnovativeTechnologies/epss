<template>
    <App title="Sales Return Details" action="Print Preview" @print-preview="$navigateTo(preview,{ props: { id }})">
        <TransactionDetail trType="SR" :id="id" :fields="fields" :layout="layout" :cast="cast"></TransactionDetail>
    </App>
</template>

<script>
    export default {
        name: "ReturnDetail",
        props: ['id'],
        data(){ return {
            fields: [ 'docno','date','customer','executive','total','tax','discount','product','quantity','amount','nature','pid','taxValue' ],
            layoutValues: [ 'product','quantity','amount','nature','tax','discount','total' ],
            cast: { quantity:'quantity',amount:'rate',discount:'amount',total:'amount',tax:'rate' },
        }},
        computed: {
            layout(){ return _.mapKeys(this.layoutValues,(item) => _.capitalize(item)) },
            preview(){ return require('./ReturnPreview').default }
        }

    }
</script>
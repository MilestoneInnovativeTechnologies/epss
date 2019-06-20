<template>
    <AppList :source="source" :limit="limit"></AppList>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "CustomerRecentSaleList",
        props: ['id','limit'],
        data(){ return {
        }},
        computed:{
            ...mapGetters('Sales',['customer']),
            sales(){ return this.customer(this.id) },
            source(){ return _.map(this.sales,(item) => _.zipObject(['Doc No','Date','Customer'],[item.docno,moment(item.date).format(__.DOCDATE_FORMAT),_.round(item.total,__.AMOUNT_DECIMAML)])) }
        }
    }
</script>
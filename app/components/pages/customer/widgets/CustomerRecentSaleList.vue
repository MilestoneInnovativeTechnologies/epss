<template>
<!--    <AppList :source="source" :limit="limit"></AppList>-->
    <AppList :source="test"></AppList>
</template>

<script>
    import { mapState,mapGetters,mapActions } from 'vuex';

    export default {
        name: "CustomerRecentSaleList",
        props: ['id','limit'],
        data(){ return {
        }},
        computed:{
            ...mapGetters('Sales',['customer']), ...mapState('Sales',['saleSummary']),
            sales(){ return this.customer(this.id) },
            source(){ return _.map(this.sales,(item) => _.zipObject(['Doc No','Date','Customer'],[item.docno,moment(item.date).format(__.DOCDATE_FORMAT),_.round(item.total,__.AMOUNT_DECIMAML)])) },
            test(){ return this.saleSummary[this.id] }
        },
        methods: {
            ...mapActions('Sales',['customerSaleSummary','_stock']),
        },
        created() {
            // this.customerSaleSummary(this.id)
            let query = `SELECT TR._ref,TR.docno,TR.date, SUM(DT.total) total FROM transactions TR,transaction_details DT WHERE TR._ref = DT.\`transaction\` AND TR.customer = "${this.id}" GROUP BY TR._ref`;
            this._stock({ query,key:'saleSummary',path:this.id });
        }
    }
</script>
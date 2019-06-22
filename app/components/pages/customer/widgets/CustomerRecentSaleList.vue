<template>
    <AppList :source="source" :limit="limit" :layout="layout" :title="title"></AppList>
</template>

<script>
    import { mapActions,mapState } from 'vuex';

    export default {
        name: "CustomerRecentSaleList",
        props: ['id','limit','title'],
        data(){ return {
            query: `SELECT TR._ref,TR.docno,TR.date, SUM(DT.total) total FROM transactions TR,transaction_details DT WHERE TR._ref = DT.\`transaction\` AND TR.customer = "${this.id}" AND TR.fncode LIKE 'SL%' GROUP BY TR._ref ORDER BY \`date\` ASC`,
            layout: { 'DOC NO':'docno',Date:'date',Total:'total' },
            cast: { date:'docdate',total:'amount' }
        }},
        computed:{
            ...mapState('Sales',['customerSaleSummary']),
            source(){ return __.cast(this.customerSaleSummary[this.id],this.cast) }
        },
        methods: {
            ...mapActions('Sales',['_stock']),
        },
        created() {
            this._stock({ query:this.query,key:'customerSaleSummary',path:this.id });
        }
    }
</script>
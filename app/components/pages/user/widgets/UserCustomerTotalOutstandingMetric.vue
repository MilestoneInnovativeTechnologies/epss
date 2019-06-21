<template>
    <AppMetric :items="items"></AppMetric>
</template>

<script>
    import { mapState,mapGetters,mapActions } from 'vuex';

    export default {
        name: "UserCustomerTotalOutstandingMetric",
        data(){ return {
            queryTemplate: `SELECT SUM(outstanding_normal) normal, SUM(outstanding_overdue) overdue, SUM(outstanding_critical) critical FROM users WHERE id IN ("#USERS#")`,
            metricTemplate: ['normal','overdue','critical'],
            metricIcons: ['attach_money','error_outline','warning'],
            size:25, coloured: true,
            itemKeys: ['coloured','size','icon','text','title']
        } },
        computed: {
            ...mapGetters('User',['customers']), ...mapState('User',['outstanding']),
            query(){ return _.replace(this.queryTemplate,/#USERS#/g,this.customers.join('","'))},
            itemText(){ return this.outstanding['all'][0] },
            items(){ return _.map(this.metricTemplate,(title,idx) => _.zipObject(this.itemKeys,[this.coloured,this.size,this.metricIcons[idx],_.round(this.itemText[title],__.AMOUNT_DECIMAL),title])) }
        },
        methods: {
            ...mapActions('User',['_stock']),
        },
        created() {
            this._stock({ query:this.query,key:'outstanding',path:'all' });
        }
    }
</script>
<template>
    <AppMetric :items="items"></AppMetric>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "CustomerOutstandingMetric",
        props: ['id'],
        data(){ return {
            metricTemplate: ['outstanding','overdue','critical'],
            metricIcons: ['attach_money','error_outline','warning'],
            size:25, coloured: true
        }},
        computed:{
            ...mapGetters('Customer',['_tableDataItem']),
            customer(){ return this._tableDataItem('users',this.id) },
            outstanding(){ return _.round(_.get(this.customer,'outstanding_normal'),__.AMOUNT_DECIMAL) },
            overdue(){ return _.round(_.get(this.customer,'outstanding_overdue'),__.AMOUNT_DECIMAL) },
            critical(){ return _.round(_.get(this.customer,'outstanding_critical'),__.AMOUNT_DECIMAL) },
            items(){ let vm = this; return _.map(this.metricTemplate,(item,idx) => _.zipObject(['coloured','size','title','text','icon'],[vm.coloured,vm.size,item,vm[item],vm.metricIcons[idx]])) },
        },
    }
</script>
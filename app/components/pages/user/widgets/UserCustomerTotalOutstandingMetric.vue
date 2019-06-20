<template>
    <AppMetric :items="items"></AppMetric>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "UserCustomerTotalOutstandingMetric",
        data(){ return {
            metricTemplate: ['normal','overdue','critical'],
            metricIcons: ['attach_money','error_outline','warning'],
            size:25, coloured: true
        } },
        computed: {
            ...mapGetters('User',['customers']),...mapGetters('Customer',['_tableDataById']),
            myCustomers(){ return _.pick(this._tableDataById('users'),this.customers) },
            normal(){ return this.getSum(this.myCustomers,'outstanding_normal') },
            overdue(){ return this.getSum(this.myCustomers,'outstanding_overdue') },
            critical(){ return this.getSum(this.myCustomers,'outstanding_critical') },
            items(){ let vm = this; return _.map(this.metricTemplate,(item,idx) => _.zipObject(['coloured','size','title','text','icon'],[vm.coloured,vm.size,_.upperCase(item),vm[item],vm.metricIcons[idx]])) }
        },
        methods: {
            getSum(collection,field){ return _.round(_.sum(_.flatMap(collection,(item) => _.toNumber(item[field]) )),__.AMOUNT_DECIMAL) }
        }
    }
</script>

<style scoped>

</style>
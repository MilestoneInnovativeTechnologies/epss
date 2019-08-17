<template>
    <AppMetric :items="items"></AppMetric>
</template>

<script>
    import { mapState,mapGetters,mapActions } from 'vuex';

    export default {
        name: "UserCustomerTotalOutstandingMetric",
        data(){ return {
            metricTemplate: ['outstanding','overdue'],
            metricIcons: ['attach_money','warning'],
            size:25, coloured: true,
            itemKeys: ['coloured','size','icon','text','title']
        } },
        computed: {
            ...mapState('Customer',['list']),
            itemText(){ return _.mapValues(_.zipObject(this.metricTemplate,this.metricTemplate),(type) => this.getSum(type) ) },
            items(){ let vm = this; return _.map(this.metricTemplate,(title,idx) => _.zipObject(vm.itemKeys,[vm.coloured,vm.size,vm.metricIcons[idx],__.amount(vm.itemText[title]),title])) }
        },
        methods: {
            getSum(key){ return __.amount(_.sum(_.map(this.list,(item) => _.toNumber(item[key])))) }
        }
    }
</script>
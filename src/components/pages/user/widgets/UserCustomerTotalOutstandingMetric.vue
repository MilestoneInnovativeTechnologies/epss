<template>
    <AppMetric :items="items" v-if="CCacheDataReady"></AppMetric>
</template>

<script>
    import {CCacheDataMixin} from "../../../../assets/scripts/mixins/ccachedata";

    export default {
        name: "UserCustomerTotalOutstandingMetric",
        mixins: [CCacheDataMixin],
        data(){ return {
            metricTemplate: ['outstanding','overdue'],
            metricIcons: ['attach_money','warning'],
            size:25, coloured: true,
            itemKeys: ['coloured','size','icon','text','title','detail'],
        } },
        computed: {
            itemText(){ return _.mapValues(_.zipObject(this.metricTemplate,this.metricTemplate),(type) => this.getSum(type) ) },
            items(){ let vm = this; return _.map(this.metricTemplate,(title,idx) => _.zipObject(vm.itemKeys,[vm.coloured,vm.size,vm.metricIcons[idx],__.amount(vm.itemText[title]),title,'customer/Customer'+(_.startCase(title))+'List'])) }
        },
        methods: {
            getSum(key){ return __.amount(_.sum(_.map(this.customers,(item) => _.toNumber(item[key])))) }
        },
        created(){ this.CCacheDataPrepare({ table:'users',key:'customers' }); }
    }
</script>
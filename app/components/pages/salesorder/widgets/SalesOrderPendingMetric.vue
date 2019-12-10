<template>
    <AppMetric :items="items" v-if="CCacheDataReady"></AppMetric>
</template>

<script>
    import {CCacheDataMixin} from "../../../../assets/scripts/mixins/ccachedata";

    export default {
        name: "SalesOrderPendingMetric",
        mixins: [CCacheDataMixin],
        data(){ return {
            metricTemplate: ['Incomplete','Partial'],
            metricIcons: [],
            coloured: true, size:30,
            ready: false,
        }},
        computed: {
            progressCount(){ return _.countBy(this.sales_order,'progress'); },
            items(){ let vm = this; return _.map(this.metricTemplate,(item) => _.zipObject(['text','title','coloured','size'],[_.toSafeInteger(vm.progressCount[item]),_.upperCase(item),vm.coloured,vm.size])) }
        },
        created(){ this.CCacheDataPrepare({ table:'sales_order',method:'dataById' }); }
    }
</script>
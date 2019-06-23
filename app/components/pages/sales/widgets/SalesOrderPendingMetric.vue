<template>
    <AppMetric :items="items"></AppMetric>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "SalesOrderPendingMetric",
        data(){ return {
            metricTemplate: ['Incomplete','Partial'],
            metricIcons: [],
            coloured: true, size:30
        }},
        computed: {
            ...mapState('SalesOrder',['list']),
            pCount(){ return _.countBy(this.list,'progress') },
            items(){ let vm = this; return _.map(this.metricTemplate,(item) => _.zipObject(['text','title','coloured','size'],[_.toSafeInteger(vm.pCount[item]),_.upperCase(item),vm.coloured,vm.size])) }
        },
    }
</script>
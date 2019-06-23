<template>
    <AppMetric :items="items"></AppMetric>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "SalesOrderPendingMetric",
        data(){ return {
            metricTemplate: ['Incomplete','Partial'],
            metricIcons: [],
            coloured: true, size:30
        }},
        computed: {
            ...mapGetters('SalesOrder',{ pCount:'progressCount' }),
            items(){ let vm = this; return _.map(this.metricTemplate,(item) => _.zipObject(['text','title','coloured','size'],[_.toSafeInteger(vm.pCount[item]),_.upperCase(item),vm.coloured,vm.size])) }
        },
    }
</script>
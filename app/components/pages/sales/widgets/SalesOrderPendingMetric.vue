<template>
    <AppMetric :items="items"></AppMetric>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "SalesOrderPendingMetric",
        data(){ return {
            metricTemplate: ['pending','partial'],
            metricIcons: [],
            coloured: true, size:30
        }},
        computed: {
            ...mapGetters('SalesOrder',{ SOPending:'pending',SOPartial:'partial'}),
            pending(){ return _.size(this.SOPending) }, partial(){ return _.size(this.SOPartial) },
            items(){ let vm = this; return _.map(this.metricTemplate,(item) => _.zipObject(['text','title','coloured','size'],[vm[item],_.upperCase(item),vm.coloured,vm.size])) }
        },
    }
</script>

<style scoped>

</style>
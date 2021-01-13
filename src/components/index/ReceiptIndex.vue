<template>
    <App :title="title" action="Create New" @create-new="createNew">
        <AppMetric :items="metricItems" v-if="CCacheDataReady && weeklyMetric"></AppMetric>
        <ReceiptList v-if="CCacheDataReady" :receipts="receipts[fncode]" :limit="10" :title="'Recent ' + title" class="m-t-15"></ReceiptList>
        <AppMetric v-if="CCacheDataReady && monthlyMetric" :items="monthlyMetricItem" class="m-t-30"></AppMetric>
    </App>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {CCacheDataMixin} from "../../assets/scripts/mixins/ccachedata";
    import {ThisObj} from "../../assets/scripts/mixins/tobj";
    const { ReceiptNew } = require('./../../assets/scripts/navigations');
    const metricItemKeys = ['coloured','size','text','title'], metricSize = 25, metricColoured = true;

    export default {
        name: "ReceiptIndex",
        mixins: [ThisObj,CCacheDataMixin],
        props: ['fycode','fncode','store'],
        data(){ return {
            receipts: {},
        } },
        computed: {
            ...mapGetters(['dateToSeconds','startOfDay','startOfWeek','startOfMonth']), ...mapGetters({ settings:'Settings/setting'}),
            weeklyMetric(){ return this.settings('receipts_daily_weekly_metric_on_receipt_index') === 'Yes' },
            monthlyMetric(){ return this.settings('receipts_monthly_metric_on_receipt_index') !== 'No' },
            title(){ return _.get(_.filter(this.$store.state['Menu'].content,(itm) => itm.fncode === this.fncode),'0.name') },
            metricTemplate(){ return { today:this.startOfDay,'this week':this.startOfWeek } },
            metricItems(){
                let vm = this; return _.map(this.metricTemplate,(time,title) => _.zipObject(metricItemKeys,[metricColoured,metricSize,vm.getTotalAfter(_.toSafeInteger(time)),_.startCase(title)]))
            },
            monthlyMetricItem(){ let vm = this; return [_.zipObject(metricItemKeys,[metricColoured,metricSize,vm.getTotalAfter(_.toSafeInteger(this.startOfMonth)),'This Month'])] }
        },
        methods: {
            createNew(){ this.$navigateTo(ReceiptNew.default,{ props:this.TO_Get(['store','fycode','fncode','title']) }) },
            getTotalAfter(time){
                if(!this.receipts || !this.receipts[this.fncode] || this.receipts[this.fncode].length === 0) return 0;
                let total = _.sumBy(this.receipts[this.fncode],({ amount,date }) => _.toSafeInteger(this.dateToSeconds(date)) >= time ? _.toNumber(amount) : 0);
                return __.amount(total);
            },
        },
        created(){ this.CCacheDataPrepare({ table:'receipts',method:'dataByGroup',args:'fncode' }) }
    }
</script>
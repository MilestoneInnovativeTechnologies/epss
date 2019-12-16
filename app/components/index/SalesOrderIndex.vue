<template>
    <App :title="title" action="Add New" @add-new="createNew">
        <StackLayout v-if="CCacheDataReady">
            <AppMetric :items="dailyMetricItem" v-if="dailyMetric"></AppMetric>
            <SalesOrderList v-if="transactions" :transactions="transactions" :limit="10" :title="'Recent ' + title" class="m-t-15"></SalesOrderList>
            <AlignMiddle v-else><TextHeadingSub>No Transactions Yet</TextHeadingSub></AlignMiddle>
            <AppMetric :items="periodMetricItem" v-if="periodMetric" class="m-t-30"></AppMetric>
        </StackLayout>
    </App>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import {WideScreenCheck} from "../../assets/scripts/mixins/widescreencheck";
    import {ThisObj} from "../../assets/scripts/mixins/tobj";
    import {NewSalesOrder, NewSalesOrderAdvanced} from "../../assets/scripts/navigations";
    import {CCacheDataMixin} from "../../assets/scripts/mixins/ccachedata";
    const metricItemKeys = ['coloured','size','text','title'], metricSize = 25, metricColoured = true;

    export default {
        name: "SalesOrderIndex",
        mixins: [ThisObj,WideScreenCheck,CCacheDataMixin],
        props: ['fycode','fncode','store'],
        data(){ return {
            sales_order: {},
        } },
        computed: {
            ...mapState('Menu',['content']),
            ...mapGetters(['startOfDay','startOfWeek','startOfMonth','dateToSeconds']),
            ...mapGetters({ settings:'Settings/setting'}),
            transactions(){ return _(this.sales_order).keyBy('id').values().value() },
            title(){ return _.get(_.filter(this.content,(itm) => itm.fncode === this.fncode),'0.name') },
            dailyMetric(){ return this.settings('daily_sales_total_amount_in_sales_order_index') !== 'No' },
            periodMetric(){ return this.settings('weekly_and_monthly_sales_total_amount_in_sales_order_index') === 'Yes' },
            dailyMetricItem(){
                let vm = this; return [_.zipObject(metricItemKeys,[metricColoured,metricSize,vm.getTotalAfter(_.toSafeInteger(this.startOfDay)),'Sales Today'])]
            },
            periodMetricItem(){
                let vm = this;
                return _.map({ 'week sales':this.startOfWeek, 'month sales':this.startOfMonth },(time,title) =>
                    _.zipObject(metricItemKeys,[metricColoured,metricSize,vm.getTotalAfter(_.toSafeInteger(time)),title])
                );
            },
        },
        methods: {
            getTotalAfter(time){
                let total = _.sumBy(this.fnTrans,({ date,quantity,rate,tax,discount01,discount02 }) => _.toSafeInteger(this.dateToSeconds(date)) >= time ? this.getTotalCalculated(quantity,rate,tax,discount01,discount02) : 0);
                return __.amount(total);
            },
            getTotalCalculated(qty,rate,tax,dis1,dis2){
                return _.toNumber(qty) * _.toNumber(rate) + _.toNumber(tax) - _.toNumber(dis1) - _.toNumber(dis2);
            },
            createNew(){
                let navComponent = this.WSC_isWide ? NewSalesOrderAdvanced : NewSalesOrder;
                this.$navigateTo(navComponent,{ props:this.TO_Get(['store','fycode','fncode','title']) });
            }
        },
        created() { this.CCacheDataPrepare({ table:'sales_order',method:'dataByGroup',args:'fncode',get:this.fncode }); }
    }
</script>
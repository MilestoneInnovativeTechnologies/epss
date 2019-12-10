<template>
    <App :title="title" action="Create New" @create-new="createNew">
        <StackLayout v-if="CCacheDataReady">
            <AppMetric :items="dailyMetricItem" v-if="dailyMetric"></AppMetric>
            <TransactionList v-if="fnTrans" :transactions="fnTrans" :limit="10" :title="'Recent ' + title" class="m-t-15"></TransactionList>
            <AlignMiddle v-else><TextHeadingSub>No Transactions Yet</TextHeadingSub></AlignMiddle>
            <AppMetric :items="periodMetricItem" v-if="periodMetric" class="m-t-30"></AppMetric>
        </StackLayout>
    </App>
</template>

<script>
    import { mapState,mapGetters } from 'vuex';
    import {WideScreenCheck} from "../../assets/scripts/mixins/widescreencheck";
    import {ThisObj} from "../../assets/scripts/mixins/tobj";
    import {NewSaleTransaction, NewSaleTransactionAdvanced} from "../../assets/scripts/navigations";
    import {CCacheDataMixin} from "../../assets/scripts/mixins/ccachedata";

    const metricItemKeys = ['coloured','size','text','title'], metricSize = 25, metricColoured = true;

    export default {
        name: "SalesIndex",
        mixins: [ThisObj,WideScreenCheck,CCacheDataMixin],
        props: ['fycode','fncode','store'],
        data(){ return { transactions: {} } },
        computed: {
            ...mapState('Menu',['content']),
            ...mapGetters(['startOfDay','startOfWeek','startOfMonth','dateToSeconds']),
            ...mapGetters({ settings:'Settings/setting'}),
            title(){ return _.get(_.filter(this.content,(itm) => itm.fncode === this.fncode),'0.name') },
            fnTrans(){ return this.transactions[this.fncode] },
            dailyMetric(){ return this.settings('daily_sales_total_amount_in_sales_index') !== 'No' },
            periodMetric(){ return this.settings('weekly_and_monthly_sales_total_amount_in_sales_index') === 'Yes' },
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
                let navComponent = this.WSC_isWide ? NewSaleTransactionAdvanced : NewSaleTransaction;
                this.$navigateTo(navComponent,{ props:this.TO_Get(['store','fycode','fncode','title']) });
            }
        },
        created() {
            this.CCacheDataPrepare({ table:'transactions',method:'dataByGroup',args:'fncode' });
        }

    }
</script>
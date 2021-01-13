<template>
    <App title="Sales Summary" action="Print" @print="doPrint">
        <TextHeading :text="'Sales Details - ' + new Date(from*1000)" />
        <TransactionList v-if="source" :transactions="source" :layout="layout" :limit="50" class="m-t-15"></TransactionList>
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../../assets/scripts/mixins/ccachedata";
    import {mapGetters} from "vuex";
    import {FnPrint} from "../../../assets/scripts/mixins/fnprint";
    const Layout = { Customer:'customer',Doc:'docno',Amount:'amount' }
    export default {
        name: "SalesDailyReport",
        mixins: [CCacheDataMixin,FnPrint],
        props: ['fncode','from'],
        data(){ return {
            transactions: {}, print:1, layout:Layout,
        } },
        computed: {
            period(){ return _(this.transactions).filter(({ date }) => new Date(date).getTime() > parseInt(this.from) * 1000).groupBy('docno').value() },
            source(){ let vm = this, keys = ['id'].concat(_.values(Layout)); return _.map(this.period,trans => _.zipObject(keys,_.map(keys,key => _.get(_.first(trans),key,vm.exec(key,trans))))) }
        },
        methods: {
            exec(method,args){ return _.isFunction(this[method]) ? this[method](args) : '-' },
            amount(trans){
                let N = _.toNumber;
                return _.sumBy(trans,(T) => (N(T.rate)*N(T.quantity))+N(T.tax)-N(T.discount01)-N(T.discount02))
            },
            time(trans){ return _.get(_.first(trans),'date').toString().split(" ")[1] },
            doPrint(){ this.FnPrint({}) },
        },
        created() {
            this.CCacheDataPrepare({ table:'transactions',method:'dataByGroup',args:'fncode',get:this.fncode });
        }
    }
</script>

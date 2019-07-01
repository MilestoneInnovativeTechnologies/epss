<template>
    <App title="Sales Return" action="New Return" @new-return="$navigateTo(newReturn)">
        <AppMetric :items="metricOne"></AppMetric>
        <AppMetric :items="metricTwo"></AppMetric>
        <AppList :source="source" :layout="layout" :links="links" detail="sales/ReturnDetail" :title="title" class="m-t-15"></AppList>
    </App>
</template>

<script>
    import { mapActions,mapState } from 'vuex';
    import {TransactionQueryBuilder} from "../../../assets/scripts/services/transactionquery";
    import {PeriodDateTime} from "../../../assets/scripts/mixins/perioddatetime";
    import {fetch_total_sale_returns_of_a_period} from "../../../assets/scripts/queries";

    export default {
        name: "SalesReturnIndex",
        mixins: [PeriodDateTime],
        data(){ return {
            title: 'Recent Sales Return',
            fields: ['docno','date','customer','cid','id'],
            layout: { Customer:'customer',Date:'date','DOC NO':'docno' },
            cast: { date:'docdate' },
            limit: 10, max: 30, root:'transactions',path:'SR',
            links: { customer:['customer/CustomerDetail',{ id:'cid' }] },
            newReturn: require('./ReturnNew').default,
        }},
        computed: {
            ...mapState('Sales',['transactions','metric']), ...mapState('User',['id']),
            source(){ return __.cast(this[this.root][this.path],this.cast) },
            metricOne(){ return [{ title: 'Total Returns - Today', text:this.getMetricTotalText(this.startOfDay) }] },
            metricTwo(){ return [{ title: 'Total Returns - Week', text:this.getMetricTotalText(this.startOfWeek) },{ title: 'Total Returns - Month', text:this.getMetricTotalText(this.startOfMonth) }] },
        },
        methods: {
            ...mapActions('Sales',['_stockIfNot','_stock']),
            getMetricTotalText(key){ return __.amount(_.get(this.metric,[this.path,key,0,'total'],'0,00')) },
            getMetricPath(key){ return [this.path,key].join('.') },
        },
        created() {
            let query = new TransactionQueryBuilder(this.path).fields(this.fields).max(this.max).query();
            this._stockIfNot({ query,key:this.root,path:this.path });
            this._stock({ query:sql.format(fetch_total_sale_returns_of_a_period,[this.id,this.startOfDay]),key:'metric',path:this.getMetricPath(this.startOfDay) });
            this._stock({ query:sql.format(fetch_total_sale_returns_of_a_period,[this.id,this.startOfWeek]),key:'metric',path:this.getMetricPath(this.startOfWeek) });
            this._stock({ query:sql.format(fetch_total_sale_returns_of_a_period,[this.id,this.startOfMonth]),key:'metric',path:this.getMetricPath(this.startOfMonth) });
        }
    }
</script>
<template>
    <App title="Sales" action="New Sale" @new-sale="$navigateTo(newSale)">
        <AppMetric :items="metricOne"></AppMetric>
        <AppMetric :items="metricTwo"></AppMetric>
        <AppList :source="source" :layout="layout" :links="links" detail="sales/SaleDetail" :title="title" class="m-t-15"></AppList>
    </App>
</template>

<script>
    import { mapActions,mapState } from 'vuex';
    import {TransactionQueryBuilder} from "../../../assets/scripts/services/transactionquery";
    import {fetch_total_sale_details_of_a_period} from "../../../assets/scripts/queries";

    export default {
        name: "SalesIndex",
        data(){ return {
            title: 'Recent Sales',
            fields: ['docno','date','customer','cid','id'],
            layout: { Customer:'customer',Date:'date','DOC NO':'docno' },
            cast: { date:'docdate' },
            limit: 10, max: 30, root:'transactions',path:'SL',
            links: { customer:['customer/CustomerDetail',{ id:'cid' }] },
            newSale: require('./SaleNew').default,
        }},
        computed: {
            ...mapState('Sales',['transactions','metric']), ...mapState('User',['id']),
            source(){ return __.cast(this[this.root][this.path],this.cast) },
            startOfDay(){ return moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'); },
            startOfWeek(){ return moment().startOf('week').format('YYYY-MM-DD HH:mm:ss'); },
            startOfMonth(){ return moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'); },
            metricOne(){ return [{ title: 'Total Sales - Today', text:this.getMetricTotalText(this.startOfDay) }] },
            metricTwo(){ return [{ title: 'Total Sales - Week', text:this.getMetricTotalText(this.startOfWeek) },{ title: 'Total Sales - Month', text:this.getMetricTotalText(this.startOfMonth) }] },
        },
        methods: {
            ...mapActions('Sales',['_stockIfNot','_stock']),
            getMetricTotalText(key){ return __.amount(this.metric[key][0]['total'] || '0.00') }
        },
        created() {
            let query = new TransactionQueryBuilder('SL').fields(this.fields).max(this.max).query();
            this._stockIfNot({ query,key:this.root,path:this.path,on:3 });
            this._stock({ query:sql.format(fetch_total_sale_details_of_a_period,[this.id,this.startOfDay]),key:'metric',path:this.startOfDay });
            this._stock({ query:sql.format(fetch_total_sale_details_of_a_period,[this.id,this.startOfWeek]),key:'metric',path:this.startOfWeek });
            this._stock({ query:sql.format(fetch_total_sale_details_of_a_period,[this.id,this.startOfMonth]),key:'metric',path:this.startOfMonth });
        }
    }
</script>
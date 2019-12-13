<template>
    <App title="Customer Details">
        <StackLayout v-if="customer">
            <TextTitle :text="customer.name"/>
            <TextTitleSubSmall :text="customer.code" class="m-b-8" />
            <AppInfoWide title="Phone" :text="customer.phone" />
            <AppInfoWide title="Email" :text="customer.email" />
            <AppMetric :items="dueMetric" class="m-t-20"></AppMetric>
            <TransactionList class="m-t-15" v-if="customerTransactions" :transactions="customerTransactions" :layout="layout" :cast="cast" title="Recent Transactions" limit="5" />
            <ReceiptList class="m-t-15" v-if="receipts && receipts.length" :receipts="receipts" :layout="layout" :cast="cast" title="Recent Receipts" limit="5"></ReceiptList>
        </StackLayout>
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../../assets/scripts/mixins/ccachedata";
    const layout = { DOCNo:'docno',Date:'date',Amount:'amount' };
    const cast = { date:'docdate',amount:'amount' };

    export default {
        name: "CustomerDetail",
        props: ['id'],
        data(){ return { layout,cast,transactions:[],receipts:[] } },
        mixins: [CCacheDataMixin],
        computed: {
            customer(){ return this.customers[this.id]; },
            dueMetric(){ return _.map(_.pick(this.customer,['outstanding','overdue']),metricItem); },
            customerTransactions(){ return (this.transactions && this.transactions.length) ? _.map(_.groupBy(this.transactions,'id'),calc) : []; },
        },
        created() {
            this.CCacheDataPrepare({table: 'users', key: 'customers', method: 'dataById'});
            this.CCacheDataPrepare({table: 'transactions', method: 'dataByGroup', args:'cid', get:this.id});
            this.CCacheDataPrepare({table: 'receipts', method: 'dataByGroup', args:'cid', get:this.id});
        }
    }

    function metricItem(amount,item){ return { text:__.amount(amount),title:_.startCase(item),coloured:true } }
    function itemTotal({ quantity,rate,tax,discount01,discount02 }){ return _.toNumber(quantity) * _.toNumber(rate) + _.toNumber(tax) - _.toNumber(discount01) - _.toNumber(discount02); }
    function calc(transactions){ return _.set(transactions[0],'amount',_.sumBy(transactions,itemTotal)); }
</script>
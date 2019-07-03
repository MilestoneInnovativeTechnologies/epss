<template>
    <AppMetric :items="items"></AppMetric>
</template>

<script>
    import { mapState,mapGetters } from "vuex";

    export default {
        name: "ReceiptsTotalMonthMetric",
        props: ['mode'],
        computed: {
            ...mapState('Receipts',{ receiptList:'list' }), ...mapGetters({ wDate:'startOfWeek',mDate:'startOfMonth' }),
            receipts(){ return this.receiptList.filter(receipt =>  receipt.mode === this.mode) },
            wTotal(){ return _.sumBy(this.receipts,receipt => (parseInt(moment(receipt.date).format('X')) >= parseInt(this.wDate)) ? _.toNumber(receipt.amount) : 0) },
            mTotal(){ return _.sumBy(this.receipts,receipt => (parseInt(moment(receipt.date).format('X')) >= parseInt(this.mDate)) ? _.toNumber(receipt.amount) : 0) },
            items(){ return [{ text:__.amount(this.wTotal),title:'This Week' },{ text:__.amount(this.mTotal),title:'This Month' }] }
        }

    }
</script>
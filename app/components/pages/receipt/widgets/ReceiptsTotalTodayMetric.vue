<template>
    <AppMetric :items="items"></AppMetric>
</template>

<script>
    import { mapState,mapGetters } from "vuex";

    export default {
        name: "ReceiptsTotalTodayMetric",
        props: ['mode'],
        computed: {
            ...mapState('Receipts',{ receiptList:'list' }), ...mapGetters({ tDate:'startOfDay' }),
            receipts(){ return this.receiptList.filter(receipt => parseInt(moment(receipt.date).format('X')) >= parseInt(this.tDate) ) },
            total(){ return _.sumBy(this.receipts,receipt => _.toNumber(receipt.amount)) },
            modeTotal(){ return _.sumBy(this.receipts,receipt => receipt.mode === this.mode ? _.toNumber(receipt.amount) : 0) },
            items(){ return [{ text:__.amount(this.total),title:'All - Today' },{ text:__.amount(this.modeTotal),title:this.mode +' - Today' }] }
        }
    }
</script>
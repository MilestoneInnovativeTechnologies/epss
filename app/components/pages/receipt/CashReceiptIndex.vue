<template>
    <App title="Cash Receipt" action="New Receipt" @new-receipt="$navigateTo(require('./ReceiptNew').default,{ backstackVisible:false })">
        <TextTitleSub>Total Receipts</TextTitleSub>
        <ReceiptsTotalTodayMetric mode="Cash"></ReceiptsTotalTodayMetric>
        <ReceiptList :receipts="receipts" :limit="5" title="Recent Receipts" class="m-t-15"></ReceiptList>
        <TextTitleSubSmall class="m-t-15">Total Cash Receipts</TextTitleSubSmall>
        <ReceiptsTotalMonthMetric mode="Cash"></ReceiptsTotalMonthMetric>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {fetch_all_active_receipts} from "../../../assets/scripts/queries";
    import TextHeading from "../../typography/TextHeading";

    export default {
        name: "CashReceiptIndex",
        components: {TextHeading},
        data() { return {
            page: 'Cash',
        }},
        computed: {
            ...mapState('Receipts',['list']),
            receipts(){ return this.list.filter(item => item.mode === this.page) }
        },
        methods: {
            ...mapActions('Receipts',{ stockReceipt:'_stockIfNot' })
        },
        created() {
            this.stockReceipt({ query:sql.format(fetch_all_active_receipts) })
        }
    }
</script>
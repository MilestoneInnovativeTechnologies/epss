<template>
    <App title="Cheque Receipt" action="New Receipt" @new-receipt="$navigateTo(require('./ReceiptNew').default,{ backstackVisible:false,props:{ pMode:'Cheque'} })">
        <TextTitleSub>Total Receipts</TextTitleSub>
        <ReceiptsTotalTodayMetric mode="Cheque"></ReceiptsTotalTodayMetric>
        <ReceiptList :receipts="receipts" :limit="5" title="Recent Receipts" class="m-t-15"></ReceiptList>
        <TextTitleSub>Total Cheque Receipts</TextTitleSub>
        <ReceiptsTotalMonthMetric mode="Cheque"></ReceiptsTotalMonthMetric>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {fetch_all_active_receipts} from "../../../assets/scripts/queries";

    export default {
        name: "ChequeReceiptIndex",
        data() { return {
            page: 'Cheque',
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
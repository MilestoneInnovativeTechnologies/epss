<template>
    <App title="Cash Receipt" action="New Receipt" @new-receipt="$navigateTo(require('./ReceiptNew').default,{ backstackVisible:false })">
        <AppList :source="receipts" :cast="cast" :layout="layout" detail="receipt/ReceiptDetail"></AppList>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {fetch_all_active_receipts} from "../../../assets/scripts/queries";

    export default {
        name: "CashReceiptIndex",
        data() { return {
            page: 'Cash',
            cast: { date:'docdate',amount:'amount',cheque_date:'chqdate' },
            layout: { Customer:'customer',Date:'date',Amount:'amount' }
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
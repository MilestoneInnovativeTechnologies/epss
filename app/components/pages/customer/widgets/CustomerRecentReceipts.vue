<template>
    <ReceiptList :receipts="receipts" :layout="layout" :title="title" :limit="limit"></ReceiptList>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "CustomerRecentReceipts",
        props: ['id','title','limit'],
        data(){ return {
            layout: { Date:'date',Type:'mode',Amount:'amount' }
        }},
        computed: {
            ...mapState('Receipts',{ receiptList:'list' }),
            receipts(){ return this.receiptList.filter(receipt => receipt.cid == this.id) }
        }
    }
</script>
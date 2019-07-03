<template>
    <AppList :source="receipts" :layout="listLayout" :cast="listCast" :detail="listDetail" :links="listLinks"></AppList>
</template>

<script>
    export default {
        name: "ReceiptList",
        props: ['receipts','layout','cast','detail','links'],
        data(){ return {
            defaultLayout: { Customer:'customer',Date:'date',Amount:'amount' },
            defaultCast: { date:'docdate',amount:'amount' },
            defaultDetail: 'receipt/ReceiptDetail',
            defaultLinks: { customer:['customer/CustomerDetail',{ id:'cid' }] },
        }},
        computed: {
            listLayout(){ return this.layout || this.defaultLayout },
            listCast(){ return this.cast || this.defaultCast },
            listDetail(){ return this.detail || this.defaultDetail },
            listLinks(){ return this.links || this.defaultLinks },
        }
    }
</script>
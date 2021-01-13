<template>
    <AppList :source="transactions" :layout="listLayout" :cast="listCast" :detail="listDetail" :links="listLinks"  :title="title" :limit="limit"></AppList>
</template>

<script>
    export default {
        name: "TransactionList",
        props: ['transactions','layout','cast','detail','links','title','limit'],
        data(){ return {
            defaultLayout: { Customer:'customer',Date:'date',Doc:'docno' },
            defaultCast: { date:'docdate' },
            defaultDetail: 'transaction/TransactionDetail',
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
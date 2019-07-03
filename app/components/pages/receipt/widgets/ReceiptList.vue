<template>
    <AppList :source="receipts" :layout="listLayout" :cast="listCast" :detail="listDetail" :links="listLinks"  :title="title" :limit="limit"></AppList>
</template>

<script>
    import { mapActions } from 'vuex';
    import {fetch_all_active_receipts} from "../../../../assets/scripts/queries";

    export default {
        name: "ReceiptList",
        props: ['receipts','layout','cast','detail','links','title','limit'],
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
        },
        methods: mapActions('Receipts',['_stockIfNot']),
        created() {
            this._stockIfNot({ query:sql.format(fetch_all_active_receipts) })
        }
    }
</script>
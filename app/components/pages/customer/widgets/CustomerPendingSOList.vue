<template>
    <AppList v-if="sales_orders.length && customer" :key="'cpso-'+customer" title="SALES ORDERS" :source="sales_orders" :layout="layout" :cast="cast" action="select" @collection="setSelectedSO"></AppList>
</template>

<script>
    import {customer_pending_sales_order_summary} from "../../../../assets/scripts/queries";
    import { mapState,mapActions } from 'vuex'


    export default {
        name: "CustomerPendingSOList",
        props: ['customer'],
        data(){ return {
            key: 'pending_sales_order',
            layout: { 'DOC No':'docno', Date:'date', Progress:'progress' },
            cast: { date:'docdate' }
        } },
        computed: {
            ...mapState('Customer',['pending_sales_order']),
            sales_orders(){ return this[this.key][this.customer] }
        },
        methods: {
            ...mapActions('Customer',['_stockIfNot']),
            setSelectedSO(data){
                EB.$emit('customer-pending-sales-orders-selected',data)
            }
        },
        created() {
            let query = sql.format(customer_pending_sales_order_summary,this.customer);
            this._stockIfNot({ query:query,path:this.customer,key:this.key })
        }
    }
</script>
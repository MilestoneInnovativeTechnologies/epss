<template>
    <App title="Sales Order" action="New Sales Order" @new-sales-order="$navigateTo(newOrder)">
        <AppList :source="source" :layout="layout" :cast="cast" :links="links" detail="sales/SalesOrderDetail"></AppList>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {user_assigned_customer_sales_orders} from "../../../assets/scripts/queries";

    export default {
        name: "SalesOrderIndex",
        data(){ return {
            layout: { Customer:'customer',Date:'date',Status:'progress' },
            cast: { date:'docdate' },
            links: { customer:['customer/CustomerDetail',{ id:'cid' }] },
            newOrder: require('./OrderNew').default,
        }},
        computed: {
            ...mapState('SalesOrder',['list']),...mapState('User',['id']),
            source(){ return __.cast(this.list,this.cast) }
        },
        methods: {
            ...mapActions('SalesOrder',['_stockIfNot']),
        },
        created() {
            let query = sql.format(user_assigned_customer_sales_orders,this.id);
            this._stockIfNot({ query,key:'list' })
        }
    }
</script>
<template>
    <App title="Sales Order">
        <AppList :source="source" :layout="layout" :cast="cast" :links="links" detail="sales/SalesOrderDetail"></AppList>
    </App>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "SalesOrderIndex",
        data(){ return {
            layout: { Customer:'customer',Date:'date',Status:'progress' },
            cast: { date:'docdate' },
            links: { customer:['customer/CustomerDetail',{ id:'cid' }] }
        }},
        computed: {
            ...mapState('SalesOrder',['list']),
            source(){ return __.cast(this.list,this.cast) }
        }
    }
</script>
<template>
    <App title="Sales Return">
        <DevMsg></DevMsg>
        <AppList :source="source" :layout="layout" :links="links" detail="sales/SaleReturnDetail" :title="title"></AppList>
    </App>
</template>

<script>
    import { mapActions,mapState } from 'vuex';
    import {TransactionQueryBuilder} from "../../../assets/scripts/services/transactionquery";

    export default {
        name: "SalesReturnIndex",
        data(){ return {
            title: 'Recent Sales Return',
            fields: ['docno','date','customer','cid','id'],
            layout: { Customer:'customer',Date:'date','DOC NO':'docno' },
            cast: { date:'docdate' },
            limit: 10, max: 30, root:'transactions',path:'SR',
            links: { customer:['customer/CustomerDetail',{ id:'cid' }] }
        }},
        computed: {
            ...mapState('Sales',['transactions']),
            source(){ return __.cast(this[this.root][this.path],this.cast) }
        },
        methods: {
            ...mapActions('Sales',['_stockIfNot'])
        },
        created() {
            let query = new TransactionQueryBuilder(this.path).fields(this.fields).max(this.max).query();
            this._stockIfNot({ query,key:this.root,path:this.path })
        }
    }
</script>
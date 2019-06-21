<template>
    <AppList title="Recent Returns" :limit="limit" :source="recentReturnsSource" :layout="layout" :links="{ customer:['customer/CustomerDetail',{ id:'cid' }] }" detail="pages/sales/SaleReturnDetail" :props="{ id:'_ref' }"></AppList>
</template>

<script>
    import { mapGetters,mapActions,mapState } from 'vuex'

    export default {
        name: "ProductRecentReturnsList",
        props: ['id','limit'],
        data(){ return {
            layoutTemplate:['docno','customer','date','quantity','nature'],
            queryTemplate: `SELECT TR.docno,TR.customer cid, TR.date,CS.name customer,SPT.quantity,PTN.name nature,TR._ref FROM transactions TR,users CS, transaction_details TD, store_product_transactions SPT, product_transaction_natures PTN WHERE TR.customer = CS.id AND TR._ref = TD.\`transaction\` AND TD.spt = SPT._ref AND SPT.nature = PTN.id AND SPT.store IN ("#STORES#") AND TR.\`customer\` IN ("#CUSTOMERS#") AND SPT.product = "${this.id}" AND TR.fncode LIKE "SR%" ORDER BY TR.\`date\` DESC`,
        }},
        computed: {
            ...mapGetters('User',{ userStores:'stores',userCustomers:'customers' }), ...mapState('Product',['transactions']),
            query(){ return _.replace(_.replace(this.queryTemplate,/#STORES#/g,this.userStores.join('","')),/#CUSTOMERS#/,this.userCustomers.join('","')) },
            recentReturnsSource(){ return _.map(this.transactions[this.id],(item) => { return { ...item,date:(moment(item.date).format(__.DOCDATE_FORMAT)),quantity:_.round(item.quantity,__.QUANTITY_DECIMAL) } }) },
            layout(){ return _.mapKeys(this.layoutTemplate,(item) => _.capitalize(item))},
        },
        methods: {
            ...mapActions('Product',['_stock']),
        },
        created() {
            this._stock({ query:this.query,key:'transactions',path:this.id })
        }
    }
</script>
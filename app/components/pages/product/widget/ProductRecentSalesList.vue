<template>
    <AppList title="Recent Sales" :limit="limit" :source="recentSalesSource" :layout="layout" :links="{ customer:['customer/CustomerDetail',{ id:'cid' }] }"></AppList>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "ProductRecentSalesList",
        props: ['id','limit'],
        data(){ return {
            layoutTemplate:['docno','customer','date','quantity']
        }},
        computed: {
            ...mapGetters('Product',['productTrans']),
            ...mapGetters('TRPS',{ typesIdName: '_tableDataByIdName' }),
            ...mapGetters('Users',{ usersIdName: '_tableDataByIdName' }),
            ...mapGetters('Transaction',['sptTransactionDetails']),
            transactions(){ return _.orderBy(this.productTrans(this.id),(trs) => new Date(_.get(trs,'date')).getTime(),'desc') },
            transTypes(){ return _.invert(this.typesIdName('product_transaction_types')) },
            users(){ return this.usersIdName('users') },
            sales(){ let snId = this.transTypes.Sale; return _.filter(this.transactions,(trns) => _.get(trns,'type') == snId) },
            recentSalesSource(){ let vm = this; return _.mapValues(vm.sales,(sale) => {
                let saleTrans = vm.getSaleDetails(sale._ref), date = moment(sale.date).format(__.DOCDATE_FORMAT),
                    cid = _.get(saleTrans,'customer'), customer = _.get(vm.users,cid), docno = _.get(saleTrans,'docno'), quantity =_.round(sale.quantity,__.QUANTITY_DECIMAL);
                return { docno,customer,date,quantity,cid }
            }) },
            layout(){ return _.mapKeys(this.layoutTemplate,(item) => _.capitalize(item))},
        },
        methods: {
            getSaleDetails(spt){ return this.sptTransactionDetails(spt) }
        }
    }
</script>
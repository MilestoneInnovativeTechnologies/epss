<template>
    <AppList title="Recent Returns" :limit="limit" :source="recentReturnsSource" :layout="layout" :links="{ customer:['customer/CustomerDetail',{ id:'cid' }] }"></AppList>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "ProductRecentReturnsList",
        props: ['id','limit'],
        data(){ return {
            layoutTemplate:['docno','customer','date','quantity','nature']
        }},
        computed: {
            ...mapGetters('Product',['productTrans']),
            ...mapGetters('TRNS',{ naturesIdName: '_tableDataByIdName' }), ...mapGetters('TRPS',{ typesIdName: '_tableDataByIdName' }),
            ...mapGetters('Users',{ usersIdName: '_tableDataByIdName' }),
            ...mapGetters('Transaction',['sptTransactionDetails']),
            transactions(){ return _.orderBy(this.productTrans(this.id),(trs) => new Date(_.get(trs,'date')).getTime(),'desc') },
            transTypes(){ return _.mapValues(_.invert(this.typesIdName('product_transaction_types')),_.toString) },
            transNatures(){ return this.naturesIdName('product_transaction_natures') },
            users(){ return this.usersIdName('users') },
            rProdTrans(){ let rTypeId = this.transTypes.Return; return _.filter(this.transactions,(trns) => _.get(trns,'type') === rTypeId) },
            recentReturnsSource(){ let vm = this; return _.mapValues(vm.rProdTrans,(rProdTran) => {
                if(!rProdTran) return null; let rTran = vm.getReturnDetails(rProdTran._ref); if(!rTran) return null;
                let date = moment(rProdTran.date).format(__.DOCDATE_FORMAT), nature = _.get(vm.transNatures,rProdTran.nature), cid = rTran.customer,
                    customer = _.get(vm.users,cid), docno = rTran.docno, quantity =_.round(rProdTran.quantity,__.QUANTITY_DECIMAL);
                return { docno,customer,date,quantity,nature,cid }
            }) },
            layout(){ return _.mapKeys(this.layoutTemplate,(item) => _.capitalize(item))},
        },
        methods: {
            getReturnDetails(spt){ return this.sptTransactionDetails(spt) }
        }
    }
</script>

<style scoped>

</style>
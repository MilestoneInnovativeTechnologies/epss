<template>
    <AppList title="Recent Returns" :limit="limit" :source="recentReturnsSource"></AppList>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "ProductRecentReturnsList",
        props: ['id','limit'],
        computed: {
            ...mapGetters('Product',['productTrans']),
            ...mapGetters('TRNS',{ naturesIdName: '_tableDataByIdName' }), ...mapGetters('TRPS',{ typesIdName: '_tableDataByIdName' }),
            ...mapGetters('Users',{ usersIdName: '_tableDataByIdName' }),
            ...mapGetters('Transaction',['sptTransactionDetails']),
            transactions(){ return _.orderBy(this.productTrans(this.id),(trs) => new Date(_.get(trs,'date')).getTime(),'desc') },
            transTypes(){ return _.invert(this.typesIdName('product_transaction_types')) },
            transNatures(){ return _.invert(this.naturesIdName('product_transaction_natures')) },
            users(){ return this.usersIdName('users') },
            returns(){ let rTypeId = this.transTypes.Return; return _.filter(this.transactions,(trns) => _.get(trns,'type') == rTypeId) },
            recentReturnsSource(){ let vm = this; return _.mapValues(vm.returns,(returns) => {
                let returnTrans = vm.getReturnDetails(returns._ref), date = moment(returns.date).format(__.DOCDATE_FORMAT), nature = _.get(this.transNatures,returns.nature),
                    customer = _.get(vm.users,_.get(returnTrans,'customer')), docno = _.get(returnTrans,'docno'), quantity =_.round(returns.quantity,__.QUANTITY_DECIMAL);
                return { docno,customer,date,nature,quantity }
            }) }
        },
        methods: {
            getReturnDetails(spt){ return this.sptTransactionDetails(spt) }
        }
    }
</script>

<style scoped>

</style>
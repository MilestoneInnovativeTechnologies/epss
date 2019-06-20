<template>
    <AppMetric :items="metricItems"></AppMetric>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "ProductBaseDetailMetric",
        props: ['id'],
        data(){ return {
            icons: ['timeline','attach_money','local_atm'],
            titles: ['stock','price','tax'],
            size: 40,
        } },
        computed: {
            ...mapGetters('Product',['productTrans','productPrice','productTax']),
            stock(){ let { In,Out } = this.getInOut(this.id); return (_.toSafeInteger(In) - _.toSafeInteger(Out)) },
            price(){ return _.round(this.productPrice(this.id),__.RATE_DECIMAL) },
            tax(){ return _.round(_.toNumber(this.productTax(this.id))*100,__.AMOUNT_DECIMAL) + "%" },
            metricItems(){ let vm = this; return _.map(vm.titles,(title,idx) => _.zipObject(['title','text','icon','coloured','size'],[title,vm[title],vm.icons[idx],true,vm.size]))},
        },
        methods: {
            getTransactions(id){ return this.productTrans(id) },
            getInOut(id){ return _(this.getTransactions(id)).groupBy('direction').mapValues(dirArray => _.sum(_.map(dirArray,(qtyObj) => _.toSafeInteger(qtyObj.quantity)))).value() }
        }
    }
</script>
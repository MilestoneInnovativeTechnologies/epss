<template>
    <App title="Store Details">
        <TextTitle>{{ store.name }}</TextTitle>
        <AppList title="Stock List" class="m-t-15" :source="source" :maxHeadContents="4" detail="product/ProductDetail"></AppList>
    </App>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: "StoreDetail",
        props: ['id'],
        data(){ return {
            layout: { Product:'name',Stock:'stock' }
        } },
        computed: {
            ...mapGetters('Stores',['_tableDataItem']),
            ...mapGetters('SPT',['products']), ...mapGetters('Product',['_tableDataByIdName']),
            store(){ return this._tableDataItem('stores',this.id) },
            storeProducts(){ return this.products(this.id) },
            productStock(){ return _.mapValues(this.getGroupedStock(this.storeProducts),(InOutObj) => { return { ...InOutObj, Stock:(_.toSafeInteger(InOutObj['In']) - _.toSafeInteger(InOutObj['Out'])) } }) },
            allProducts(){ return this._tableDataByIdName('products','id') },
            source(){ let vm = this; return _(this.productStock).mapValues((IOObj,PID) => _.fromPairs([
                ['Product',_.get(vm.allProducts,PID)],['In',_.toSafeInteger(IOObj['In'])],['Out',_.toSafeInteger(IOObj['Out'])],['Stock',_.toSafeInteger(IOObj['Stock'])]
            ])).value() }
        },
        methods: {
            getGroupedStock(coll){
                return _(coll).groupBy('product').mapValues((pSPT => _(pSPT).groupBy('direction').mapValues(ioSPT => _.sum(_(ioSPT).map((ioSPTItem) => _.toNumber(ioSPTItem.quantity)).value())).value())).value()
            }
        }
    }
</script>
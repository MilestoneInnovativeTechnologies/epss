<template>
    <App title="Store Details">
        <TextTitle>{{ store.name }}</TextTitle>
        <AppList title="Stock List" :source="source" :layout="layout" detail="product/ProductDetail"></AppList>
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
            ...mapGetters('Stores',['_tableDataItem','_tableDataFilter','products']),
            store(){ return this._tableDataItem('stores',this.id) },
            sPrdTranSummary(){ return _(this.sProducts()).map((spt) => _.pick(spt,['direction','quantity','product'])).groupBy('product').mapValues(prdDetArray => _(prdDetArray).groupBy('direction').mapValues(directionObj => _.sumBy(directionObj,(InOutItem) => _.toSafeInteger(InOutItem.quantity))).value()).value() },
            source(){ return _.mapValues(this.sPrdTranSummary,(InOut,PID) => _.zipObject(['id','name','stock'],[PID,this.products[PID],(_.toSafeInteger(InOut.In) - _.toSafeInteger(InOut.Out))]))}
        },
        methods: {
            sProducts(){ return this._tableDataFilter('store_product_transactions','store',this.id) },
        }
    }
</script>
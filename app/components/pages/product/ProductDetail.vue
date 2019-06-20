<template>
    <App title="Product Detail">
        <TextTitle>{{ product.name }}</TextTitle>
        <ProductBaseDetailMetric :id="id"></ProductBaseDetailMetric>
        <ProductRecentSalesList limit="3" :id="id" class="m-t-10"></ProductRecentSalesList>
        <ProductRecentReturnsList limit="2" :id="id" class="m-t-10"></ProductRecentReturnsList>
    </App>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: "ProductDetail",
        props: ['id'],
        computed: {
            ...mapGetters('Product',['_tableDataItem']),
            product(){ return this._tableDataItem('products',this.id) },
        },
        methods: {
        }
    }
</script>
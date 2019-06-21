<template>
    <App title="Store Details">
        <TextTitle>{{ store.name }}</TextTitle>
        <AppList title="Stock List" class="m-t-15" :source="source" :layout="layout" :maxHeadContents="4" detail="product/ProductDetail"></AppList>
    </App>
</template>

<script>
    import { mapGetters,mapActions,mapState } from 'vuex';
    export default {
        name: "StoreDetail",
        props: ['id'],
        data(){ return {
            query_stock: `SELECT TR.product id,PR.name Product,SUM(CASE WHEN TR.direction = 'In' THEN TR.quantity ELSE 0 END) 'In',SUM(CASE WHEN TR.direction = 'Out' THEN TR.quantity ELSE 0 END) 'Out', (SUM(CASE WHEN TR.direction = 'In' THEN TR.quantity ELSE 0 END)-SUM(CASE WHEN TR.direction = 'Out' THEN TR.quantity ELSE 0 END)) Stock FROM store_product_transactions TR,products PR WHERE TR.product = PR.id AND TR.store = "${this.id}" GROUP BY TR.product`,
            layout: { Product:'Product',In:'In',Out:'Out',Stock:'Stock' }
        } },
        computed: {
            ...mapState('Stores',['stock']),...mapGetters('Stores',['stores']),
            store(){ return this.stores[this.id] },
            source(){ return this.stock[this.id] },
        },
        methods: {
            ...mapActions('Stores',['_stock']),
        },
        created(){
            this._stock({ query:this.query_stock,key:'stock',path:this.id });
        }
    }
</script>
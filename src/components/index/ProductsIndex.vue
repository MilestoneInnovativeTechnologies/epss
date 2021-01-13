<template>
    <App title="Products">
        <AppForm :fields="{ search:{ name:'search',type:'Text',label:'' } }" @search="search = $event" />
        <ReSyncButton @resync="resync" v-show="!batch.length" />
        <AppList v-if="CCacheDataReady" :source="source" :layout="layout" :cast="cast" :detail="detail" />
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../assets/scripts/mixins/ccachedata";
    const item = 'products'
    const layout = { Name:'narration',Price:'price',Stock:'stock' };
    const cast = { price:'rate' };
    const detail = 'product/ProductDetail';

    export default {
        name: "ProductsIndex",
        mixins: [CCacheDataMixin],
        data(){ return { search:'',layout,cast,detail } },
        computed: {
            source(){ return (_.trim(this.search) === '') ? this.products : this.products.filter(this.isIn) },
            batch(){ return this.$store.getters['Download/pending'] },
        },
        methods: {
            isIn({ narration }){ return _.toLower(narration).includes(_.toLower(_.trim(this.search))); },
            resync(){ this.$store.dispatch('Download/tables',[item],{ root:true }); this.CCacheDataPrepare(item) }
        },
        created(){ this.CCacheDataPrepare(item); }
    }
</script>
<template>
    <App title="Products">
        <AppForm :fields="{ search:{ name:'search',type:'Text',label:'' } }" @search="search = $event" />
        <AppList v-if="CCacheDataReady" :source="source" :layout="layout" :cast="cast" :detail="detail" />
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../assets/scripts/mixins/ccachedata";
    const layout = { Name:'narration',Price:'price' };
    const cast = { price:'rate' };
    const detail = 'product/ProductDetail';

    export default {
        name: "ProductsIndex",
        mixins: [CCacheDataMixin],
        data(){ return { search:'',layout,cast,detail } },
        computed: {
            source(){ return (_.trim(this.search) === '') ? this.products : this.products.filter(this.isIn) }
        },
        methods: {
            isIn({ narration }){ return _.toLower(narration).includes(_.toLower(_.trim(this.search))); }
        },
        created(){ this.CCacheDataPrepare('products'); }
    }
</script>
<template>
    <GridLayout rows="auto,*" columns="*" class="bcg01 p-x-10">
        <WSSaleItemsFilter col="0" row="0" @filter="filterItems"></WSSaleItemsFilter>
        <WSSaleItems col="0" row="1" :items="items"></WSSaleItems>
    </GridLayout>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: "WSSaleContainer",
        props: [],
        data(){ return {
            filter: '',
            list01: [],
            list02: [],
        } },
        computed: {
            ...mapGetters({ getProductsPerList:'Product/listProducts',getProductDetail:'Product/product' }),
            productIds(){ return (this.list01.length)
                ? (this.list02.length)
                    ? this.getProductsPerList(this.list01[0],this.list01[1],this.list02[0],this.list02[1])
                    : this.getProductsPerList(this.list01[0],this.list01[1],null,null)
                : [] },
            productDetails(){ return _.map(this.productIds,(pid) => this.getProductDetail(pid)) },
            items(){ let filter = this.filter; return filter ? _.filter(this.productDetails,(product) => this.isProductIn(product,this.filter)) : this.productDetails }
        },
        methods: {
            filterItems(text){ this.filter = text; },
            isProductIn({ name },text){ return _.includes(name.toString().toLowerCase(),text.toString().toLowerCase()) }
        },
        created(){
            EB.$on('wssale-selected-list01',(data) => { this.list01 = data });
            EB.$on('wssale-selected-list02',(data) => { this.list02 = data });
        }
    }
</script>
<template>
    <GridLayout rows="auto,*,auto" columns="*" class="bcg01 p-x-10">
        <WSSaleItemsFilter col="0" row="0" @filter="filterItems"></WSSaleItemsFilter>
        <WSSaleItems col="0" row="1" :items="items"></WSSaleItems>
        <WSSalePagination col="0" row="2" :totPage="totPage" :curPage="curPage" @change-page-to="curPage = $event === '...' ? curPage : $event" class="m-t-5 bordercp" style="border-top: 1"></WSSalePagination>
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
            perPage: 15,
            curPage: 1,
        } },
        computed: {
            ...mapGetters({ getProductsPerList:'Product/listProducts',getProductDetail:'Product/product' }),
            productIds(){
                return (this.list01.length)
                ? (this.list02.length)
                    ? this.getProductsPerList(this.list01[0],this.list01[1],this.list02[0],this.list02[1])
                    : this.getProductsPerList(this.list01[0],this.list01[1],null,null)
                : [];
            },
            productDetails(){
                return _.map(this.productIds,(pid) => this.getProductDetail(pid));
            },
            filteredItems(){
                let filter = this.filter;
                return filter ? _.filter(this.productDetails,(product) => this.isProductIn(product,this.filter)) : this.productDetails;
            },
            items(){
                let items = this.filteredItems, start = (this.curPage-1) * this.perPage, end = start + this.perPage;
                return items.slice(start,end);
            },
            totPage(){
                return Math.ceil(this.filteredItems.length / this.perPage)
            }
        },
        methods: {
            filterItems(text){ this.curPage = 1; this.filter = text; },
            isProductIn({ narration },text){ return _.includes(narration.toString().toLowerCase(),text.toString().toLowerCase()) }
        },
        created(){
            EB.$on('wssale-selected-list01',(data) => { this.list01 = data; this.curPage = 1 });
            EB.$on('wssale-selected-list02',(data) => { this.list02 = data; this.curPage = 1 });
        }
    }
</script>
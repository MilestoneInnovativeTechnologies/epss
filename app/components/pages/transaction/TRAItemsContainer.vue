<template>
    <GridLayout rows="auto,*,auto" columns="*" :class="'bcg01 p-x-'+properties.containerPadding">
        <TRAItemsFilter col="0" row="0" @filter="filterText"></TRAItemsFilter>
        <TRAItems :properties="properties" col="0" row="1" v-if="items.length" :items="items"></TRAItems>
        <HorizontallyMiddle col="0" row="2">
            <TRAItemsPagination :totPage="totPage" :curPage="curPage" @change-page-to="curPage = $event === '...' ? curPage : $event" class="m-t-5 bordercp" style="border-top: 1"></TRAItemsPagination>
        </HorizontallyMiddle>
    </GridLayout>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";
    let products = [];

    export default {
        name: "TRAItemsContainer",
        mixins: [EventListeners],
        props: ['properties','list1','list2'],
        data(){ return {
            filter: '', list01: 0, list02: 0, curPage: 1, update: 0,
            events: ['tra-list01-changed','tra-list02-changed'],
        } },
        computed: {
            ...mapGetters({ getProductsPerList:'Product/listProducts',getProductDetail:'Product/product' }),

            productIds(){
                return (this.list1 && this.list01)
                    ? (this.list2 && this.list02)
                        ? this.getProductsPerList(this.list1,this.list01,this.list2,this.list02)
                        : this.getProductsPerList(this.list1,this.list01,null,null)
                    : [];
            },
            productDetails(){ return _.map(this.productIds,(pid) => products[pid]) },
            fewProductDetails(){ return _.map(this.productIds.slice(0,this.perPage*3),(pid) =>  products[pid]); },
            filteredItems(){ let filter = this.filter; return filter ? _.filter(this.productDetails,(product) => isProductIn(product,filter)) : this.fewProductDetails; },
            perPage(){ return _.toSafeInteger(this.properties.itemsPerPage); },
            items(){ let items = this.filteredItems, start = (this.curPage-1) * this.perPage, end = start + this.perPage; return items.slice(start,end); },
            totPage(){ return Math.ceil((this.filter ? this.filteredItems.length : this.productIds.length) / this.perPage) }
        },
        methods: {
            filterText(text){ this.curPage = 1; this.filter = text; },
            listener0(data){ this.list01 = data; this.curPage = 1; },
            listener1(data){ this.list02 = data; this.curPage = 1; },
        },
        created(){ products = CCache['products'].all(); }
    }

    function isProductIn(product,text){ return (product && text && product.narration && product.narration.toLowerCase().includes(text.toLowerCase()))  }
</script>
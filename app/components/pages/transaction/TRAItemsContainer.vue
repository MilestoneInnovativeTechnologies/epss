<template>
    <GridLayout rows="auto,*,auto" columns="*" :class="'bcg01 p-x-'+properties.containerPadding">
        <TRAItemsFilter col="0" row="0" @filter="filterText"></TRAItemsFilter>
        <TRAItems :properties="properties" col="0" row="1" v-if="items.length" :items="items"></TRAItems>
        <HorizontallyMiddle col="0" row="2">
            <TRAItemsPagination :totPage="TotalPages" :curPage="curPage" @change-page-to="curPage = $event === '...' ? curPage : $event" class="m-t-5 bordercp" style="border-top: 1"></TRAItemsPagination>
        </HorizontallyMiddle>
    </GridLayout>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";
    let products = {};

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
            itemsPerPage(){ return _.toSafeInteger(this.properties.itemsPerPage); },
            pageItemsStartIdx(){ return (this.curPage < 2) ? 0 : this.itemsPerPage * (this.curPage - 1) },
            pageItemsEndsIdx(){ return this.pageItemsStartIdx + this.itemsPerPage },

            ListProductIDs(){
                return (this.list1 && this.list01)
                    ? (this.list2 && this.list02)
                        ? this.getProductsPerList(this.list1,this.list01,this.list2,this.list02)
                        : this.getProductsPerList(this.list1,this.list01,null,null)
                    : [];
            },
            FilteredProductIDs(){ let filter = this.filter.toString().toLowerCase().trim(), IDs = this.ListProductIDs; return _.isEmpty(filter) ? IDs : getProductsFiltered(filter,IDs) },
            PageVisibleProductIDs(){ let FilteredProductIDs = this.FilteredProductIDs; return FilteredProductIDs.slice(this.pageItemsStartIdx,this.pageItemsEndsIdx); },
            items(){ let ItemIDs = this.PageVisibleProductIDs; return _.map(ItemIDs,(id) => products[id]) },
            TotalPages(){ return Math.ceil(this.FilteredProductIDs.length/this.itemsPerPage) }
        },
        methods: {
            filterText(text){ this.curPage = 1; this.filter = text; },
            listener0(data){ this.list01 = data; this.curPage = 1; },
            listener1(data){ this.list02 = data; this.curPage = 1; },
        },
        created(){ products = CCache['products'].dataById(); }
    }

    function getProductsFiltered(text,ids){
        return _.filter(ids,id => { let narration = products[id] ? _.trim(products[id].narration).toLowerCase() : ''; return narration.includes(text) });
    }
</script>
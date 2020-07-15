<template>
    <GridLayout rows="auto,*,auto" columns="*" :class="'bcg01 p-x-'+properties.containerPadding">
        <TRAItemsFilter col="0" row="0" @textChange="filter = $event" />
        <TRAItems :properties="properties" col="0" row="1" v-if="CCacheDataReady && items.length" :items="items" />
        <HorizontallyMiddle col="0" row="2">
            <TRAItemsPagination :totPage="TotalPages" :curPage="curPage" @change-page-to="curPage = $event === '...' ? curPage : $event" class="m-t-5 bordercp" style="border-top: 1"></TRAItemsPagination>
        </HorizontallyMiddle>
    </GridLayout>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";
    import {CCacheDataMixin} from "../../../assets/scripts/mixins/ccachedata";

    export default {
        name: "TRAItemsContainer",
        mixins: [EventListeners,CCacheDataMixin],
        props: ['properties','list1','list2','seq'],
        data(){ return {
            filter: '', list01: 0, list02: 0, curPage: 1,
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
            FilteredProductIDs(){ let filter = this.filter.toString().toLowerCase().trim(), IDs = this.ListProductIDs; return _.isEmpty(filter) ? IDs : this.getProductsFiltered(filter,IDs) },
            PageVisibleProductIDs(){ let FilteredProductIDs = this.FilteredProductIDs; return FilteredProductIDs.slice(this.pageItemsStartIdx,this.pageItemsEndsIdx); },
            items(){ let ItemIDs = this.PageVisibleProductIDs; return _.map(ItemIDs,(id) => this.products[id]) },
            TotalPages(){ return Math.ceil(this.FilteredProductIDs.length/this.itemsPerPage) }
        },
        methods: {
            getProductsFiltered(text,ids){ this.curPage = 1; return _.filter(ids,id => { let narration = this.products[id] ? _.trim(this.products[id].narration).toLowerCase() : ''; return narration.includes(text) }) },
            listener0(data){ this.list01 = data[1]; this.curPage = 1 },
            listener1(data){ this.list02 = data[1]; this.curPage = 1 },
        },
        watch: {
            seq(val){ this.filter = ''; this.curPage = 1 }
        },
        created(){ this.CCacheDataPrepare({ table:'products',method:'dataById' }); }
    }
</script>

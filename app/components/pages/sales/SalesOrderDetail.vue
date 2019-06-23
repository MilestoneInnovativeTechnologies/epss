<template>
    <App title="Sales Order Detail">
        <StackLayout v-if="detail">
            <TextHeading class="text-center" width="100%">NO DETAILS AVAILABLE</TextHeading>
        </StackLayout>
        <StackLayout v-else>
            <TextTitle>{{ detail.docno }}</TextTitle>
            <TextHeading class="m-b-15">{{ detail.customer }}</TextHeading>
            <AppInfoWide title="date">{{ docdate(detail.date) }}</AppInfoWide>
            <AppList :source="source" :layout="layout" title="Products" class="m-t-15" detail="product/ProductDetail" :props="{ id:'pid' }"></AppList>
        </StackLayout>
    </App>
</template>

<script>
    import { mapState,mapGetters,mapActions } from 'vuex';
    import {sales_order_items_of_a_sales_order} from "../../../assets/scripts/queries";

    export default {
        name: "SalesOrderDetail",
        props: ['id'],
        data(){ return {
            key: 'products', cacheOn:0,
            layout: { Product:'product',Quantity:'quantity',Rate:'rate' },
            cast: { quantity:'quantity',rate:'rate' }
        }},
        computed: {
            ...mapGetters('SalesOrder',['_stateDataItemByKey']),...mapState('SalesOrder',['list','products']),
            detail(){ return this._stateDataItemByKey('list','_ref',this.id); },
            source(){ return __.cast(this.products[this.id],this.cast) }
        },
        methods: {
            ...mapActions('SalesOrder',['_stockIfNot']),
            docdate(date){ return __.docdate(date) }
        },
        created() {
            let query = sql.format(sales_order_items_of_a_sales_order,[this.id]);
            this._stockIfNot({ query,key:this.key,path:this.id,on:this.cacheOn })
        }
    }
</script>
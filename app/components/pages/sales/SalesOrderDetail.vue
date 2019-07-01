<template>
    <App title="Sales Order Detail">
        <StackLayout v-if="detail">

            <TextTitle>{{ detail.docno }}</TextTitle>
            <TextTitleSub class="m-b-15">{{ detail.customer }}</TextTitleSub>
            <AppInfoWide title="date">{{ docdate(detail.date) }}</AppInfoWide>
            <AppInfoWide title="executive" class="m-b-15">{{ detail.executive }}</AppInfoWide>

            <AppList :source="source" :layout="layout" title="Products" class="m-t-15" detail="product/ProductDetail" :props="{ id:'pid' }"></AppList>

            <GridLayout rows="auto" columns="*,*,*" class="m-t-15">
                <AppInfoWithLabel row="0" col="0" title="TAX">{{ round(sum('tax')) }}</AppInfoWithLabel>
                <AppInfoWithLabel row="0" col="1" title="DISCOUNT">{{ round(sum('discount')) }}</AppInfoWithLabel>
                <AppInfoWithLabel row="0" col="2" title="AMOUNT">{{ round(sum('total')) }}</AppInfoWithLabel>
            </GridLayout>

            <AppInfoHighlight title="payable amount" class="m-t-20">{{ round(sum('total')) }}</AppInfoHighlight>

        </StackLayout>
        <StackLayout v-else>
            <TextHeading class="text-center" width="100%">NO DETAILS AVAILABLE</TextHeading>
        </StackLayout>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import { sales_order_items_of_a_sales_order } from "../../../assets/scripts/queries";

    export default {
        name: "SalesOrderDetail",
        props: ['id'],
        data(){ return {
            key: 'products', cacheOn:0,
            layout: { Product:'product',Quantity:'quantity',Rate:'rate',Tax:'tax',Discount:'discount',Total:'total' },
            cast: { quantity:'quantity',rate:'rate',tax:'rate',discount:'amount',total:'amount' }
        }},
        computed: {
            ...mapState('SalesOrder',['list','products']),
            detail(){ return this.list[_.findKey(this.list,['id',this.id])]; },
            source(){ return __.cast(this.products[this.id],this.cast) }
        },
        methods: {
            ...mapActions('SalesOrder',['_stockIfNot']),
            docdate(date){ return __.docdate(date) },
            sum(field){ return _.sum(_.map(this.products[this.id],(item) => _.toNumber(item[field]))) },
            round(number){ return __.amount(number).toFixed(__.AMOUNT_DECIMAL) },
        },
        created() {
            let query = sql.format(sales_order_items_of_a_sales_order,[this.id]);
            this._stockIfNot({ query,key:this.key,path:this.id,on:this.cacheOn });
        }
    }
</script>
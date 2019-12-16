<template>
    <App title="Product Details">
        <StackLayout v-if="CCacheDataReady && product">
            <TextTitle :text="product.name" />
            <TextTitleSubSmall :text="product.narration" />
            <AppMetric :items="metricItems" class="m-y-15" />
            <AppInfoWide v-for="(title,field,idx) in infoWide" :title="title" :text="product[field]" :key="'pd-wi-'+idx" />
            <TransactionList v-if="transactions && transactions.length" title="Recent sales with this product" :transactions="transactions" :layout="layout" :cast="cast" class="m-t-15" />
            <SalesOrderList v-if="sales_order && sales_order.length" title="Recent orders with this product" :transactions="sales_order" :layout="layout" :cast="cast" class="m-t-15" />
        </StackLayout>
        <TextHeadingSub v-else>No details available</TextHeadingSub>
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../../assets/scripts/mixins/ccachedata";
    import {get_product_stock} from "../../../assets/scripts/queries";
    import AppInfoWide from "../../app/info/AppInfoWide";
    const icons = { stock:'gradient',price:'attach_money' };
    const layout = { DOCNo:'docno',Date:'date',Quantity:'quantity' };
    const cast = { quantity:'quantity',date:'docdate' };
    const infoWide = { code:'Item Code',uom:'UOM' };

    export default {
        name: "ProductDetail",
        components: {AppInfoWide},
        props: ['id'],
        data(){ return {
            product: {}, stock: 0,
            transactions: null, sales_order: null,
            layout, cast, infoWide
        } },
        mixins: [CCacheDataMixin],
        computed: {
            metricItems(){ return _.map(['stock','price'],item => metricItem(item,__.rate(this.product[item]))) }
        },
        methods: {
            updateProductStock({ id,stock }){
                if(!_.isNil(stock)) return;
                DB.getAllQuery(sql.format(get_product_stock,id),function(vm){
                    if(this.error) return; let stock = _.toNumber(this.result[0].stock);
                    vm.stock = stock; vm.$set(vm.product,'stock',stock);
                },[this])
            }
        },
        created() {
            this.CCacheDataPrepare({table: 'products', key: 'product', method: 'dataById', get:this.id });
            this.CCacheDataPrepare({table: 'transactions', method: 'dataByGroup', args:'pid', get:this.id });
            this.CCacheDataPrepare({table: 'sales_order', method: 'dataByGroup', args:'pid', get:this.id });
        },
        watch: {
            product: {
                deep: true,
                handler: 'updateProductStock'
            }
        }
    }

    function metricItem(item,text){ return { coloured:true,title:_.startCase(item),text,icon:icons[item],size:25 } }
</script>
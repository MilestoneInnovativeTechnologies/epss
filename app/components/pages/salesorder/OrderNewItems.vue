<template>
    <App title="NEW SALES ORDER - ITEMS" :action="action" @save="save">
        <GridLayout rows="auto,auto" columns="*">
            <AppFormDetail row="0" col="0" :source="tblSource" :layout="tblLayout" :fields="appFormFields()" :fieldValues="fieldValues" :labels="labels" :labelValues="labelValues" @ff-active="ffActive = $event" @collection="collection" @done="done" @final="updateLabels" :instance="instance"></AppFormDetail>
            <StackLayout row="1" col="0">
                <AppInfoWideNumerical class="m-t-20" title="Total Tax" :text="toRate(tTax)"></AppInfoWideNumerical>
                <AppInfoWideNumerical title="Total Amount" :text="toAmount(tAmount)"></AppInfoWideNumerical>
                <AppInfoHighlight title="AMOUNT PAYABLE" :text="toAmount(pAmount)"></AppInfoHighlight>
            </StackLayout>
        </GridLayout>
    </App>
</template>

<script>
    import { mapActions,mapGetters } from 'vuex';
    import {fetch_all_products, user_assigned_customer_sales_orders} from "../../../assets/scripts/queries";
    const feMX = require("../../../assets/scripts/mixins/formelement");

    export default {
        name: "OrderNewItems",
        props: ['master'],
        data() {
            return {
                tblSource: [], tblLayout: { Product:'name', Quantity:'quantity', Total:'total' },
                fieldLayout: { product:'Product',quantity:'Quantity' }, fieldValues: { quantity:1 },
                labels: ['rate','tax','amount'], labelValues: { rate:0,tax:0,amount:0 },
                instance: 0, ffActive: false,
                items: [], oItems: [],
                discount:0, tTax:0, tAmount:0
            }
        },
        mixins: [feMX.common, feMX.product, feMX.quantity],
        computed: {
            ...mapGetters({ _ref:'_ref',total:'total',user:'user',productsById:'Product/_stateDataById' }),
            action(){ return this.ffActive ? null : 'SAVE' },
            products(){ return this.productsById('list') },
            pAmount(){ return (this.tTax + this.tAmount) - _.toNumber(this.discount) }
        },
        methods: {
            ...mapActions({ stockProduct: 'Product/_stockIfNot',enterOrder:'SalesOrder/order',stockOrder:'SalesOrder/_stock'}),
            toAmount(amount){ return __.amount(amount) }, toRate(amount){ return __.rate(amount) },
            collection(items){ this.items = items; let tTotal = this.getTotal(items); this.tTax = tTotal.tax; this.tAmount = tTotal.amount; },
            updateLabels({ product,quantity }){
                if(!product || !this.products[product]) return;
                let prd = this.getPrdProps(product), qty = quantity || 0, rate = __.rate(prd.rate), tax = prd.tax + '%', amount = this.toAmount(this.total(prd.rate,qty,prd.taxValue));
                this.labelValues = Object.assign({},this.labelValues,{ rate,tax,amount })
            },
            getPrdProps(pid){
                let p = this.products[pid];
                return _.zipObject(['id','name','rate','tax','taxValue'],[pid,p.name,_.toNumber(p.price),_.toNumber(p.tax)*100,_.toNumber(p.tax)]);
            },
            done(data){ this.instance = this.tblSource.push(this.getSourceData(data)) },
            getSourceData({ product,quantity }) {
                let p = this.products[product];
                return Object.assign({},_.zipObject(['product','quantity','name','total'],[product,quantity,p.name,this.toAmount(this.total(p.price,quantity,p.tax))]));
            },
            getTotal(items){
                let tTotal = Object.assign({},{ tax:0, amount:0 });
                _.forEach(items,(item) => { let tObj = this.getItemTotal(item); tTotal.tax += tObj.tax; tTotal.amount += tObj.amount; });
                return Object.assign({},tTotal);
            },
            getItemTotal({product,quantity}){
                let p = this.products[product], amount = _.toNumber(p.price) * _.toNumber(quantity), tax = amount * _.toNumber(p.tax);
                return { amount,tax };
            },
            setExtras(items){
                _.forEach(items,({product,quantity}) => {
                    let iTotal = this.getItemTotal({product,quantity}), total = _.sum(_.toArray(iTotal)) - this.discount;
                    let prd = this.getPrdProps(product);
                    let oItem = _.zipObject(['so','product','rate','quantity','tax','discount','total','_ref'],[
                        this.master._ref,product,prd.rate,quantity,iTotal.tax,this.discount,total,this.master._ref
                    ]); this.oItems.push(oItem);
                });
                return true;
            },
            save(){
                let status = this.setExtras(this.items);
                if(!this.oItems.length) return alert('You didn\'t added any products..');
                this.enterOrder({ master:this.master, details:this.oItems }).then((_ref) => {
                    this.stockOrder({ query:sql.format(user_assigned_customer_sales_orders,this.user),key:'list' });
                    this.$navigateTo(require('./SalesOrderDetail').default,{ props:{ id:_ref }})
                })
            },
        },
        created() { this.stockProduct({ query:sql.format(fetch_all_products),key:'list' }); }
    }
</script>
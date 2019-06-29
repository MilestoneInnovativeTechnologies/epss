<template>
    <App title="NEW SALE - ITEMS" :action="action" @save="save">
        <GridLayout rows="auto,auto" columns="*">
            <AppFormDetail row="0" col="0" :source="tblSource" :layout="tblLayout" :fields="appFormFields()" :labels="labels" :labelValues="labelValues" @ff-active="ffActive = $event" @collection="collection" @done="done" @final="updateLabels" :instance="instance"></AppFormDetail>
            <StackLayout row="1" col="0">
                <AppInfoWideNumerical class="m-t-20" title="Total Tax" :text="toRate(tTax)"></AppInfoWideNumerical>
                <AppInfoWideNumerical title="Total Amount" :text="toAmount(tAmount)"></AppInfoWideNumerical>
                <AppInfoHighlight title="AMOUNT PAYABLE" :text="toAmount(pAmount)"></AppInfoHighlight>
            </StackLayout>
        </GridLayout>
    </App>
</template>

<script>
    import { mapActions,mapGetters,mapState } from 'vuex';
    import {fetch_all_products} from "../../../assets/scripts/queries";
    const feMX = require("./../../../assets/scripts/mixins/formelement");

    export default {
        name: "SaleNewItems",
        props: ['master','store'],
        data() {
            return {
                tblSource: [], tblLayout: { Product:'name', Quantity:'quantity', Total:'total' },
                fieldLayout: { product:'Product',quantity:'Quantity' },
                labels: ['rate','tax','amount'], labelValues: { rate:0,tax:0,amount:0 },
                instance: 0, ffActive: false,
                items: [], spt: [], td: [],
                discount:0, tTax:0, tAmount:0
            }
        },
        mixins: [feMX.common, feMX.product, feMX.quantity],
        computed: {
            ...mapGetters({ _ref:'_ref',total:'total',productsById:'Product/_stateDataById',natureEnum:'TRNS/NameId',typeEnum:'TRPS/NameId',datetime:'datetime',sptSale:'SPT/sale' }), ...mapState({ userId: state => state.User.id }),
            action(){ return this.ffActive ? null : 'SAVE' },
            products(){ return this.productsById('list') },
            pAmount(){ return (this.tTax + this.tAmount) - _.toNumber(this.discount) }
        },
        methods: {
            ...mapActions({ stockProduct: 'Product/_stockIfNot',dbInsert:'_insert'}),
            toAmount(amount){ return __.amount(amount) }, toRate(amount){ return __.rate(amount) },
            collection(items){ this.items = items; let tTotal = this.getTotal(items); this.tTax = tTotal.tax; this.tAmount = tTotal.amount; },
            updateLabels({ product,quantity }){
                let prd = this.products[product], qty = quantity || 0, rate = __.rate(prd.price), tax = __.rate(_.toNumber(prd.tax)*100), amount = this.toAmount(this.total(prd.price,qty,prd.tax));
                this.labelValues = Object.assign({},this.labelValues,{ rate,tax,amount })
            },
            done(data){ this.instance = this.tblSource.push(this.getSourceData(data)) },
            getSourceData({ product,quantity }) {
                let p = this.products[product];
                return Object.assign({},_.zipObject(['product','quantity','name','total'],[product,quantity,p.name,this.toAmount(this.total(p.price,quantity,p.tax))]));
            },
            getTotal(items){
                let tTotal = Object.assign({},{ tax:0, amount:0 });
                _.forEach(items,(item) => { let tObj = this.getItemTotal(item); tTotal.tax += tObj.tax; tTotal.amount = tObj.amount; });
                return Object.assign({},tTotal);
            },
            getItemTotal({product,quantity}){
                let p = this.products[product], amount = _.toNumber(p.price) * _.toNumber(quantity), tax = amount * _.toNumber(p.tax);
                return { amount,tax };
            },
            setExtras(items){
                _.forEach(items,({product,quantity}) => {
                    let spt = this.sptSale(this.store,product,quantity); this.spt.push(spt);
                    let iTotal = this.getItemTotal({product,quantity}), total = _.sum(_.toArray(iTotal)) - this.discount;
                    let td = _.zipObject(['transaction','spt','amount','tax','discount','total'],[
                        this.master._ref,spt._ref,iTotal.amount,iTotal.tax,this.discount,total
                    ]); this.td.push(td);
                });
                return true;
            },
            save(){
                let status = this.setExtras(this.items);
                this.dbInsert({ table:'transactions',data:this.master,success:this.insertSPT,vm:this })
            },
            insertSPT(){ this.dbInsert({ table:'store_product_transactions',data:this.spt,success:this.insertTD,vm:this }); },
            insertTD(){ this.dbInsert({ table:'transaction_details',data:this.td,success:this.doneInsert,vm:this }); },
            doneInsert(){},
        },
        created() { this.stockProduct({ query:sql.format(fetch_all_products),key:'list' }); }
    }
</script>
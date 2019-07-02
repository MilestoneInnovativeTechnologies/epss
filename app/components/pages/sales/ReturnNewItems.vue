<template>
    <App title="New Sales Return - Items" :action="action" @save="SaveSR">
        <GridLayout rows="auto,auto,auto,auto" columns="*">
            <AppList row="0" col="0" title="Sale Products" :layout="PPLayout" :source="PPSrc"></AppList>
            <TextHeading row="1" class="m-y-10">Removed Items</TextHeading>
            <AppFormDetail row="2" col="0" :source="RPSrc" :layout="RPLayout" :fields="appFormFields()" :fieldValues="fieldValues" :labels="labels" :labelValues="labelValues" @ff-active="ffActive = $event" @final="updateLabels" @collection="setCollected" @done="addItem" :instance="instance"></AppFormDetail>
            <StackLayout row="3" col="0" class="m-t-20">
                <AppInfoWideNumerical title="Total Tax" :text="tAmount"></AppInfoWideNumerical>
                <AppInfoWideNumerical title="Total Amount" :text="tTax"></AppInfoWideNumerical>
                <AppInfoHighlight title="AMOUNT PAYABLE" :text="tTotal"></AppInfoHighlight>
            </StackLayout>
        </GridLayout>

    </App>
</template>

<script>
    import { mapState,mapGetters,mapActions } from "vuex";
    import {TransactionQueryBuilder} from "../../../assets/scripts/services/transactionquery";
    const feMX = require("../../../assets/scripts/mixins/formelement");

    export default {
        name: "ReturnNewItems",
        props: ['master','sales','store','transaction'],
        mixins: [feMX.common,feMX.returnsaleproducts,feMX.quantity,feMX.nature],
        data(){ return {
            PPLayout: { Product:'product',Quantity:'quantity',Rate:'rate','Tax/Qty':'tax',Discount:'discount',Total:'total' },
            PPCast: { quantity:'quantity',rate:'rate',tax:'rate',discount:'amount',total:'amount' },
            RPSrc:[],
            RPLayout: { Product:'product',Nature:'nName',Quantity:'quantity',Rate:'rate',Tax:'tax',Total:'total' },
            fieldLayout: { product:'ReturnSaleProduct',quantity:'Quantity',nature:'Nature' },
            fieldValues: { quantity:1 },
            labels: ['rate','tax','discount','total'],
            labelValues: { rate:0,tax:0,discount:0,total:0 },
            instance: 0, ffActive: false,
            removedItems: [],
            tAmount:0, tTax:0
        }},
        computed: {
            ...mapState('Transaction',['detail']),...mapGetters({ taxTotal:'total',_ref:'_ref',user:'user',datetime:'datetime',NbIds:'TRNS/_tableDataById',TEnum:'TRPS/NameId' }),
            action(){ return this.ffActive ? null : 'SAVE' },
            cProducts(){ return _.map(this.detail[this.sales],(sale) => this.trnDetailToPrds(sale)) },
            PPSrc(){ return __.cast(this.cProducts,this.PPCast) },
            natures(){ return this.NbIds('product_transaction_natures') },
            tTotal(){ return this.tAmount+this.tTax }
        },
        methods: {
            ...mapActions({ stockTrnDetail:'Transaction/_stockIfNot',enterReturn:'Sales/sReturn' }),
            trnDetailToPrds(detail){
                let Obj = _.pick(detail,['pid','product','quantity','amount','taxRate','taxValue']);//,'rate','tax','discount'
                let qty = _.toNumber(detail['quantity']);
                Obj['rate'] = _.toNumber(detail['amount'])/qty;
                Obj['tax'] = _.toNumber(detail['tax'])/qty;
                Obj['discount'] = _.toNumber(detail['discount'])/qty;
                Obj['total'] = __.amount(detail['total']);
                return Obj;
            },
            getSalePrdDetails(pid){ return _.keyBy(this.cProducts,'pid')[pid] },
            updateLabels({ product,quantity }){
                let p = this.getSalePrdDetails(product), qty = _.toNumber(quantity);
                let labelValues = _.zipObject(['rate','tax','discount','total'],[
                   p.rate,p.tax,p.discount,this.taxTotal(p.rate,qty,p.taxValue)
                ]);
                this.labelValues = Object.assign({},this.labelValues,__.cast(labelValues,this.PPCast));
            },
            setCollected(items){ this.removedItems = items; this.updateTotals(items) },
            updateTotals(items){
                let tAmount = 0, tTax = 0;
                _.forEach(items,(item) => {
                    let iTtl = this.getTotal(item);
                    tAmount += iTtl.amount; tTax += iTtl.tax;
                });
                this.tAmount = __.amount(tAmount); this.tTax = __.rate(tTax);
            },
            getTotal(item){
                let rate = _.toNumber(item.rate), quantity = _.toNumber(item.quantity), tax = _.toNumber(item.tax), discount = _.toNumber(item.discount);
                return { tax:tax*quantity,amount:rate*quantity,discount };
            },
            addItem(item){
                this.RPSrc.push(this.getRPSrc(item))
            },
            getRPSrc(item){
                let pid = item.product, p = this.getSalePrdDetails(pid), nature = item.nature, nName = this.natures[nature]['name'], rate = p.rate, quantity = _.toNumber(item.quantity);
                let tax = __.rate(p.tax * quantity), discount = __.amount(_.toNumber(p.discount)/quantity), amount = __.amount(p.rate * quantity), total = __.amount(amount+tax-discount);
                return { pid,product:p.product,rate,nature,nName,quantity,tax,discount,amount,total,_ref:this._ref() }
            },
            SaveSR(){
                let data = this.getPreparedData();
                this.enterReturn(data).then((id) => {
                    this.$navigateTo(require('./ReturnDetail').default,{ props:{ id } })
                });
            },
            getPreparedData(){
                let t = this.master,td = [], spt = [];
                _.forEach(this.removedItems,(item) => {
                    let tdObj = _.zipObject(['transaction','spt','amount','tax','discount','total'],[
                        this.transaction,item._ref,item.amount,item.tax,item.discount,item.total
                    ]); td.push(tdObj);
                    let sptObj = _.zipObject(['store','product','direction','quantity','user','nature','date','type','_ref'],[
                        this.store,item.pid,'In',item.quantity,this.user,item.nature,this.datetime(),this.TEnum.Return,item._ref
                    ]); spt.push(sptObj);
                });
                return { transactions:t,transaction_details:td,store_product_transactions:spt }
            },
        },
        created() {
            let query = new TransactionQueryBuilder('SL').fields([ 'docno','date','customer','executive','total','tax','discount','product','quantity','amount','rate','taxRate','taxValue','pid' ]).where({ id:this.sales }).query();
            this.stockTrnDetail({ query:query,key:'detail',path:this.sales })
        }
    }
</script>
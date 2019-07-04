<template>
    <App title="Stock Unload - Items" action="Save" @save="save">
        <AppList :source="source" :layout="listLayout" action="select" @collection="collection = $event"></AppList>
    </App>
</template>

<script>
    import { mapGetters,mapActions,mapState } from 'vuex'
    import {fetch_all_products, fetch_current_stock_list_of_a_store} from "../../../assets/scripts/queries";

    export default {
        name: "StockUnloadItems",
        props: ['store','fycode'],
        data(){ return {
            listLayout: { Product:'product',Quantity:'stock','Unload':'unload' },
            listCast: { stock:'quantity',unload:'quantity' },
            links: { unload:['stock/StockUnloadItemQuantity',{ id:'id',max:'stock',current:'unload' }] },
            listSource: [],
            collection: [],
        }},
        computed: {
            ...mapGetters({ ref:'_ref',spt:'SPT/tOut',stockDocno:'Stock/outDocno',datetime:'datetime',total:'total'
                ,settings:'Settings/setting',user:'user' }),
            ...mapState('Product',['list']),
            fncode(){ return this.settings('STOCKTRANSFEROUTFNCODE') },
            docno(){ return this.stockDocno(this.store,this.fycode,this.fncode) },
            source(){ return __.cast(this.listSource,this.listCast )},
            products(){ return _.keyBy(this.list,'id') }
        },
        methods: {
            ...mapActions({ stockStock:'Stock/_stock',stockProduct:'Product/_stockIfNot',stockTransfer:'Stock/transferOut' }),
            transaction(){ return _.zipObject(['_ref','docno','user','date','fycode','fncode','payment_type'],[
                this.ref(),this.docno,this.user,this.datetime(),this.fycode,this.fncode,'Credit'
            ]) },
            save(){
                let data = this.getPreparedData({ store:this.store, products:this.collection.map(({ id,unload }) => _.zipObject(['product','quantity'],[id,unload])) });
                this.stockTransfer(data).then(({ docno }) => {
                    alert({ title: "Success!!", message: "Material Transfer Out has done.\nDocument No: "+docno, okButtonText: "Go Home" })
                        .then(() => { this.$navigateTo(require('./../../Home').default); });
                })
            },
            getPreparedData({ products,store}){
                let trns = this.transaction(), tDetail = [], spt = [], refParts = this.ref().split('T'),refInt = parseInt(refParts[1]);
                _.forEach(products,({ product,quantity },idx) => {
                    let qty = _.toNumber(quantity), p = this.products[product];
                    let sptObj = this.spt(store,product,quantity); sptObj._ref = [refParts[0],refInt+idx].join('T'); spt.push(sptObj);
                    let trnRef = trns._ref, sptRef = sptObj._ref,
                        amount = _.toNumber(p.price) * qty, tax = amount * _.toNumber(p.tax), total = this.total(p.price,qty,p.tax);
                    let tDetObj = { transaction:trnRef,spt:sptRef,amount,tax,discount:0,total }; tDetail.push(tDetObj);
                });
                return _.zipObject(['transactions','transaction_details','store_product_transactions'],[trns,tDetail,spt])
            }
        },
        created() {
            this.stockStock({ query:sql.format(fetch_current_stock_list_of_a_store,this.store) }).then((list) => {
                this.listSource = (Array.isArray(list) && list.length) ? list.filter((item) => !!_.toNumber(item.stock)).map(stock => { stock.unload = stock.stock; return stock }) : [];
                this.stockProduct({ query:sql.format(fetch_all_products) })
            })
        }
    }
</script>
<template>
    <App :title="title" action="Save Transaction" @save-transaction="saveTransaction">
        <AppForm :key="'saf-'+saved" :values="values" :fields="fields()" @final="setHeader"></AppForm>
        <AppList title="Products" action="remove" :source="PS_items" :layout="pLayout()" :key="'nst-al-'+PS_update+'-'+saved" class="m-t-20" @remove="PS_DeleteItem"></AppList>
        <GridLayout rows="auto" columns="*,140">
            <Label col="0" text="" />
            <AppButton col="1" @tap.native="FFPS_ShowForm">Add Products</AppButton>
        </GridLayout>
        <PayableAmount class="m-t-10" :amount="PS_TotalAmount" :tax="PS_TotalTax" :discount="PS_TotalDiscount"></PayableAmount>
    </App>
</template>

<script>
    import { mapGetters,mapActions } from 'vuex';
    import {ThisObj} from "../../../assets/scripts/mixins/tobj";
    import {FloatFormProductSale} from "../../../assets/scripts/mixins/floatformproductsale";
    import {NewSaleTransaction, PrintModal} from "../../../assets/scripts/navigations";

    const feMX = require('./../../../assets/scripts/mixins/formelement');
    const TRF = ['_ref','user','store','docno','date','customer','fycode','fncode','payment_type'];
    const TDF = ['transaction','store','product','direction','quantity','rate','taxrule','tax','discount01','discount02','soi'];
    const HFields = { date:'DatePicker',customer: 'Customer',payment_type:'Payment' };
    const DFields = { product:'Product',quantity:'Quantity',rate:'Rate',discount:'Decimal' };
    const PLayouts = { Name:'narration',Quantity:'quantity',Total:'total',Rate:'rate',Tax:'taxdisplay',Discount:'discount' };



    const template = [
        { type:'raw',source:'transactions',keys:{ docno:'Document',date:'Date',customer_name:'Customer',payment_type:'Payment Type' } },
        { type:'feed', amount:1 },
        { type:'table',source:'transaction_details',heads:['Particulars','QTY','Rate','Total'],keys:['particular','quantity','rate','total'] },
        { type:'feed', amount:1 },
        { type:'raw',source:'summary',keys:{ subtotal:'Sub Total',totaltax:'Total Tax',totaldiscount:'Total Discount' } },
        { type:'line' },
        { type:'raw',source:'summary',keys:{ total:'Total Payable' } },
    ];



    export default {
        name: "NewSaleTransaction",
        mixins: [ThisObj,FloatFormProductSale,feMX.common,feMX.datepicker,feMX.customer,feMX.payment,feMX.product,feMX.quantity,feMX.rate,feMX.decimal],
        props: ['store','fycode','fncode','title'],
        data(){ return {
            customer: null, payment_type: null, date: null, transaction: null, direction: 'Out',
            saved: 0,
        } },
        computed: {
            ...mapGetters({ curDate:'date',user:'user',nRef:'_ref',saleDocNo:'Reserves/get',toDateTime:'toDateTime' }),
            values(){ return { date:this.curDate() } },
            taxEnabled(){ return (__.TAX === 'Yes' || __.TAX02 === 'Yes') }
        },
        methods: {
            ...mapActions('Transaction',{ saveSaleTransaction:'save' }),
            docno(){ return this.saleDocNo(this.store,this.fycode,this.fncode) },
            _ref(){ let ref = this.nRef(); this.transaction = ref; return ref; },
            fields(){ return this.appFormFields(HFields); },
            setHeader(data){ let hData = Object.assign({},data,{ date:this.toDateTime(data.date) }); this.TO_SetPropFromObj(hData); },
            pLayout(){ return this.taxEnabled ? PLayouts : _.omit(PLayouts,'tax') },
            saveTransaction(){
                if(this.PS_items.length < 1) return alert('Please add products!!');
                let transactions = this.TO_Get(TRF);
                let transaction_details = _.map(this.PS_items,(item) => this.TO_Get(TDF,item));
                this.saveSaleTransaction({ transactions,transaction_details })
                    .then(ref => {
                        this.$showModal(PrintModal,{ props: { title:this.title,data:this.getPrintDataObjects(transactions,transaction_details),template },fullscreen:true })
                            .then(print_data => this.$navigateTo(NewSaleTransaction,{ props:this.TO_Get(['store','fycode','fncode','title']) }))
                    });
            },




            ...mapGetters({ customerDetail:'Customer/customer',productDetail:'Product/product' }),
            getPrintDataObjects(transactions,transaction_details){
                transactions = _.set(transactions,'customer_name',transactions.customer ? _.get(this.customerDetail(transactions.customer),'name') : 'Cash Customer');
                transaction_details = _.map(transaction_details,detail => {
                    let prd = this.productDetail(detail.product);
                    detail['particular'] =`${prd.narration} ${ this.taxEnabled?`\n${detail.taxrule}: ${detail.tax}`:`` } ${ (detail.discount01+detail.discount02) ?`\nDiscount: ${detail.discount01+detail.discount02}`:`` }`;
                    detail['total'] =_.toNumber(detail.quantity)*_.toNumber(detail.rate)+_.toNumber(detail.tax)-_.toNumber(detail.discount01)-_.toNumber(detail.discount02);
                    return detail;
                });
                let summary = {
                    subtotal: _.sumBy(transaction_details,(det) => _.toNumber(det.quantity)*_.toNumber(det.rate)),
                    totaltax: _.sumBy(transaction_details,(det) => _.toNumber(det.tax)),
                    totaldiscount: _.sumBy(transaction_details,(det) => _.toNumber(det.discount01)+_.toNumber(det.discount02)),
                    total: _.sumBy(transaction_details,(det) => _.toNumber(det.quantity)*_.toNumber(det.rate)+_.toNumber(det.tax)-_.toNumber(det.discount01)-_.toNumber(det.discount02)),
                };
                return { transactions, transaction_details, summary };
            }





        },
        created(){ setTimeout(() => this.docno(),4000) }
    }
</script>
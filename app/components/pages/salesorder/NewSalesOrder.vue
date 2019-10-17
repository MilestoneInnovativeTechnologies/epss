<template>
    <App :title="title" action="Save Transaction" @save-transaction="saveTransaction">
        <AppForm :values="values" :fields="fields()" @final="setHeader"></AppForm>
        <AppList title="Products" action="remove" :source="PS_items" :layout="pLayout()" :key="'nst-al-'+PS_update" class="m-t-20" @remove="PS_DeleteItem"></AppList>
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
    import {NewSalesOrder, PrintModal} from "../../../assets/scripts/navigations";

    const feMX = require('./../../../assets/scripts/mixins/formelement');
    const TRF = ['docno','date','user','customer','store','fycode','fncode','payment_type','progress','_ref'];
    const TDF = ['so','store','fycode','fncode','product','quantity','rate','taxrule','tax','discount01','discount02','_ref'];
    const HFields = { date:'DatePicker',customer: 'Customer',payment_type:'Payment' };
    const DFields = { product:'Product',quantity:'Quantity',rate:'Rate',discount:'Decimal' };
    const PLayouts = { Name:'narration',Quantity:'quantity',Total:'total',Rate:'rate',Tax:'taxdisplay',Discount:'discount' };


    const template = [
        { type:'raw',source:'sales_order',keys:{ docno:'Document',date:'Date',customer_name:'Customer',payment_type:'Payment Type' } },
        { type:'feed', amount:1 },
        { type:'table',source:'sales_order_items',heads:['Particulars','QTY','Rate','Total'],keys:['particular','quantity','rate','total'] },
        { type:'feed', amount:1 },
        { type:'raw',source:'summary',keys:{ subtotal:'Sub Total',totaltax:'Total Tax',totaldiscount:'Total Discount' } },
        { type:'line' },
        { type:'raw',source:'summary',keys:{ total:'Total Payable' } },
    ];




    export default {
        name: "NewSalesOrder",
        mixins: [ThisObj,FloatFormProductSale,feMX.common,feMX.datepicker,feMX.customer,feMX.payment,feMX.product,feMX.quantity,feMX.rate,feMX.decimal],
        props: ['store','fycode','fncode','title'],
        data(){ return {
            customer: null, payment_type: null, date: null, so: null, progress: 'Incomplete',
        } },
        computed: {
            ...mapGetters({ curDate:'date',user:'user',nRef:'_ref',SODocNo:'Reserves/get',toDateTime:'toDateTime' }),
            values(){ return { date:this.curDate() } },
            taxEnabled(){ return (__.TAX === 'Yes' || __.TAX02 === 'Yes') }
        },
        methods: {
            ...mapActions('Transaction',{ saveSalesOrderTransaction:'save' }),
            docno(){ return this.SODocNo(this.store,this.fycode,this.fncode) },
            _ref(){ let ref = this.nRef(); this.so = ref; return ref; },
            fields(){ return this.appFormFields(HFields); },
            setHeader(data){ let hData = Object.assign({},data,{ date:this.toDateTime(data.date) }); this.TO_SetPropFromObj(hData); },
            pLayout(){ return this.taxEnabled ? PLayouts : _.omit(PLayouts,'tax') },
            saveTransaction(){
                if(this.PS_items.length < 1) return alert('Please add products!!');
                let sales_order = this.TO_Get(TRF), sales_order_items = _.map(this.PS_items,(item) => this.TO_Get(TDF,item));
                this.saveSalesOrderTransaction({ sales_order,sales_order_items })
                    .then(ref => {
                        this.$showModal(PrintModal,{ props: { title:this.title,data:this.getPrintDataObjects(sales_order,sales_order_items),template },fullscreen:true })
                            .then(print_data => this.$navigateTo(NewSalesOrder,{ props:this.TO_Get(['store','fycode','fncode','title']) }));
                    });
            },








            ...mapGetters({ customerDetail:'Customer/customer',productDetail:'Product/product' }),
            getPrintDataObjects(sales_order, sales_order_items){
                sales_order = _.set(sales_order,'customer_name',sales_order.customer ? _.get(this.customerDetail(sales_order.customer),'name') : 'Cash Customer');
                sales_order_items = _.map(sales_order_items, detail => {
                    let prd = this.productDetail(detail.product);
                    detail['particular'] =`${prd.narration} ${ this.taxEnabled?`\n${detail.taxrule}: ${detail.tax}`:`` } ${ (detail.discount01+detail.discount02) ?`\nDiscount: ${detail.discount01+detail.discount02}`:`` }`;
                    detail['total'] =_.toNumber(detail.quantity)*_.toNumber(detail.rate)+_.toNumber(detail.tax)-_.toNumber(detail.discount01)-_.toNumber(detail.discount02);
                    return detail;
                });
                let summary = {
                    subtotal: _.sumBy(sales_order_items,(det) => _.toNumber(det.quantity)*_.toNumber(det.rate)),
                    totaltax: _.sumBy(sales_order_items,(det) => _.toNumber(det.tax)),
                    totaldiscount: _.sumBy(sales_order_items,(det) => _.toNumber(det.discount01)+_.toNumber(det.discount02)),
                    total: _.sumBy(sales_order_items,(det) => _.toNumber(det.quantity)*_.toNumber(det.rate)+_.toNumber(det.tax)-_.toNumber(det.discount01)-_.toNumber(det.discount02)),
                };
                return { sales_order,sales_order_details: sales_order_items,summary };
            },








        },
        created(){ setTimeout(() => this.docno(),4000) }
    }
</script>
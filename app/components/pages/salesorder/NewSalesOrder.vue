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
    import {NewSalesOrder} from "../../../assets/scripts/navigations";
    import {FnPrint} from "../../../assets/scripts/mixins/fnprint";
    import {FnDocReserve} from "../../../assets/scripts/mixins/fndocreserves";
    import {FiscalYearCheck} from "../../../assets/scripts/mixins/fiscalyearcheck";

    const feMX = require('./../../../assets/scripts/mixins/formelement');
    const TRF = ['docno','date','user','customer','store','fycode','fncode','payment_type','progress','_ref','status'];
    const TDF = ['so','store','fycode','fncode','product','quantity','rate','taxrule','tax','discount01','discount02','_ref'];
    const HFields = { date:'DatePicker',customer: 'Customer',payment_type:'Payment' };
    const DFields = { product:'Product',quantity:'Quantity',rate:'Rate',discount:'Decimal' };
    const PLayouts = { Name:'narration',Quantity:'quantity',Total:'total',Rate:'rate',Tax:'taxdisplay',Discount:'discount' };

    export default {
        name: "NewSalesOrder",
        mixins: [ThisObj,FloatFormProductSale,FnPrint,FnDocReserve,FiscalYearCheck,feMX.common,feMX.datepicker,feMX.customer,feMX.payment,feMX.product,feMX.quantity,feMX.rate,feMX.decimal],
        props: ['store','fycode','fncode','title'],
        data(){ return {
            customer: null, payment_type: null, date: null, so: null, progress: 'Incomplete', status: 'Active',
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
            reloadComp(){ this.$navigateTo(NewSalesOrder.default,{ props:this.TO_Get(['store','fycode','fncode','title']) }) },
            saveTransaction(){
                if(!this.FDR_ready) return alert('No any document reserved!!');
                if(this.PS_items.length < 1) return alert('Please add products!!');
                if(!this.FYC_Okey(this.date)) return alert(this.FYC_msg1);
                let sales_order = this.TO_Get(TRF), sales_order_items = _.map(this.PS_items,(item) => this.TO_Get(TDF,item));
                this.saveSalesOrderTransaction({ sales_order,sales_order_items })
                    .then(ref => this.FnPrint({ _ref:ref }).then(() => this.reloadComp()));
            },
        }
    }
</script>
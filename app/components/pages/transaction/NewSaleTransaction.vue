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
    import {NewSaleTransaction} from "../../../assets/scripts/navigations";
    import {FnPrint} from "../../../assets/scripts/mixins/fnprint";
    import {FnShiftStatus} from "../../../assets/scripts/mixins/fnshiftstatus";
    import {FnDocReserve} from "../../../assets/scripts/mixins/fndocreserves";

    const feMX = require('./../../../assets/scripts/mixins/formelement');
    const TRF = ['_ref','user','store','docno','date','customer','fycode','fncode','payment_type','status'];
    const TDF = ['transaction','store','product','direction','quantity','rate','taxrule','tax','discount01','discount02','soi','shift_docno'];
    const HFields = { date:'DatePicker',customer: 'Customer',payment_type:'Payment' };
    const DFields = { product:'Product',quantity:'Quantity',rate:'Rate',discount:'Decimal' };
    const PLayouts = { Name:'narration',Quantity:'quantity',Total:'total',Rate:'rate',Tax:'taxdisplay',Discount:'discount' };

    export default {
        name: "NewSaleTransaction",
        mixins: [ThisObj,FnShiftStatus,FnDocReserve,FloatFormProductSale,FnPrint,feMX.common,feMX.datepicker,feMX.customer,feMX.payment,feMX.product,feMX.quantity,feMX.rate,feMX.decimal],
        props: ['store','fycode','fncode','title'],
        data(){ return {
            customer: null, payment_type: null, status: 'Active', date: null, transaction: null, direction: 'Out',
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
            reloadComp(){ this.$navigateTo(NewSaleTransaction.default,{ props:this.TO_Get(['store','fycode','fncode','title']) }); },

            saveTransaction(){
                if(!this.FDR_ready) return alert('No any document reserved!!');
                if(!this.SS_ready) return alert('Shift required!!');
                if(this.PS_items.length < 1) return alert('Please add products!!');
                let transactions = this.TO_Get(TRF);
                let transaction_details = _.map(this.PS_items,(item) => this.TO_Get(TDF,item));
                this.saveSaleTransaction({ transactions,transaction_details })
                    .then(ref => this.FnPrint({ _ref:ref }).then(() => this.reloadComp()));
            },
        }
    }
</script>
<template>
    <App :title="title" action="Save" @save="saveReceipt">
        <AppForm :fields="fields" :values="values" @final="updateData"></AppForm>
    </App>
</template>

<script>
    import { mapGetters,mapActions } from 'vuex';
    import {ReceiptNew} from "../../../assets/scripts/navigations";
    import {FnPrint} from "../../../assets/scripts/mixins/fnprint";
    import {FnShiftStatus} from "../../../assets/scripts/mixins/fnshiftstatus";
    import {FnDocReserve} from "../../../assets/scripts/mixins/fndocreserves";
    import {FiscalYearCheck} from "../../../assets/scripts/mixins/fiscalyearcheck";
    const feMX = require('./../../../assets/scripts/mixins/formelement');
    const fields = { customer:'Customer',date:'DatePicker',amount:'Amount',bank:'Text',cheque:'Text',cheque_date:'DatePicker' };
    const ThisOBJ = require('./../../../assets/scripts/mixins/tobj').ThisObj;
    const FNFields = {
        'CR1': ['date','customer','amount'],
        'BR1': ['date','customer','bank','cheque','cheque_date','amount'],
        'BR2': ['date','customer','amount'],
    };
    const LabelCorrection = { bank:'Bank Name',cheque:'Cheque Number',cheque_date:'Cheque Date' };
    const saveFields = ['docno','store','fycode','fncode','user','customer','date','amount','bank','cheque_date','cheque','status','source','_ref','shift_docno'];

    export default {
        name: "ReceiptNew",
        mixins: [ThisOBJ, FnShiftStatus, FnDocReserve, FiscalYearCheck, FnPrint,feMX.common, feMX.customer, feMX.paymentmode, feMX.store, feMX.fiscal, feMX.datepicker, feMX.amount, feMX.text],
        props: ['fncode','fycode','store','title'],
        data(){ return {
            eDocno: null,
            customer: null, date: null, amount: null,
            bank: null, cheque_date: null, cheque: null, source: 'SS', status: 'Active',
        } },
        computed: {
            ...mapGetters({ curDate:'date',user:'user',nRef:'_ref',toDateTime:'toDateTime' }),
            ...mapGetters('Reserves',{ getDocNO:'get' }),
            ...mapGetters({ customerDetail:'Customer/customer',shiftDoc:'Shift/docno' }),

            values(){ return { date:this.curDate() } },
            fields(){ return this.correctLabels(this.appFormFields(_.pick(fields,FNFields[this.fncode]))) },
            docno(){ return () => this.getDocNO(this.store,this.fycode,this.fncode); },
            shift_docno(){ return () => this.shiftDoc; },
            _ref(){ return this.nRef(); },
            reloadProps(){ return this.TO_Get(['store','fycode','fncode','title']) }
        },
        methods: {
            ...mapActions('Receipts',{ saveReceiptData:'save' }),
            correctLabels(Obj) {
                let cObj = Obj;
                _.intersection(_.keys(Obj), _.keys(LabelCorrection))
                    .map(field => cObj[field]['label'] = LabelCorrection[field]);
                return cObj;
            },
            updateData(data){ let hData = Object.assign({},data,{ date:this.toDateTime(data.date) }); this.TO_SetPropFromObj(hData); },
            saveReceipt(){
                if(!this.FDR_ready) return alert('No any document reserved!!');
                if(!this.SS_ready) return alert('Shift required!!');
                if(!this.FYC_Okey(this.date)) return alert(this.FYC_msg1);
                let data = this.TO_Get(saveFields);
                this.saveReceiptData(data)//.then(ref => this.$navigateTo(ReceiptNew,{ props:this.reloadProps }))
                    .then(ref => this.FnPrint(this.TO_Get(this.FnPrintProps)).then(() => this.$navigateTo(ReceiptNew.default,{ props:this.reloadProps,backstackVisible:false })))
            },
        }
    }
</script>

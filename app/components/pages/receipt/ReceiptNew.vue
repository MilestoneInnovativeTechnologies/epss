<template>
    <App :title="title" action="Save" @save="saveReceipt">
        <AppForm :fields="fields" :values="values" @final="updateData"></AppForm>
    </App>
</template>

<script>
    import { mapGetters,mapActions } from 'vuex';
    import {ReceiptNew,PrintModal} from "../../../assets/scripts/navigations";
    const feMX = require('./../../../assets/scripts/mixins/formelement');
    const fields = { customer:'Customer',date:'DatePicker',amount:'Amount',bank:'Text',cheque:'Text',cheque_date:'DatePicker' };
    const ThisOBJ = require('./../../../assets/scripts/mixins/tobj').ThisObj;
    const FNFields = {
        'CR1': ['date','customer','amount'],
        'BR1': ['date','customer','bank','cheque','cheque_date','amount'],
        'BR2': ['date','customer','amount'],
    };
    const LabelCorrection = { bank:'Bank Name',cheque:'Cheque Number',cheque_date:'Cheque Date' };
    const saveFields = ['docno','store','fycode','fncode','user','customer','date','amount','bank','cheque_date','cheque','source','_ref'];




    const template = [
        { type:'raw',source:'receipts',keys:{ docno:'Document',date:'Date',customer_name:'Customer' } },
        { type:'line' },
        { type:'raw',source:'receipts',keys:{ amount:'Amount' } },
        { type:'line' },
        { type:'raw',source:'receipts',keys:{ cheque:'Cheque Number',cheque_date:'Cheque Date',bank:'Bank Name', } }
    ];





    export default {
        name: "ReceiptNew",
        mixins: [ThisOBJ,feMX.common, feMX.customer, feMX.paymentmode, feMX.store, feMX.fiscal, feMX.datepicker, feMX.amount, feMX.text],
        props: ['fncode','fycode','store','title'],
        data(){ return {
            eDocno: null,
            customer: null, date: null, amount: null,
            bank: null, cheque_date: null, cheque: null, source: 'SS',
        } },
        computed: {
            ...mapGetters({ curDate:'date',user:'user',nRef:'_ref',toDateTime:'toDateTime' }),
            ...mapGetters('Reserves',{ getDocNO:'get' }),
            ...mapGetters({ customerDetail:'Customer/customer' }),

            values(){ return { date:this.curDate() } },
            fields(){ return this.correctLabels(this.appFormFields(_.pick(fields,FNFields[this.fncode]))) },
            docno(){ return () => this.getDocNO(this.store,this.fycode,this.fncode); },
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
                let data = this.TO_Get(saveFields);
                this.saveReceiptData(data).then(ref => this.$navigateTo(ReceiptNew,{ props:this.reloadProps }))
                    .then(ref => {
                        let receipts = _.set(data,'customer_name',_.get(this.customerDetail(data.customer),'name'));
                        this.$showModal(PrintModal,{ props: { title:this.title,data:{ receipts },template },fullscreen:true })
                            .then(print_data => this.$navigateTo(ReceiptNew,{ props:this.reloadProps }))
                    })
            },
        },
        created(){
            setTimeout(() => this.eDocno = this.docno(),4000)
        }
    }
</script>
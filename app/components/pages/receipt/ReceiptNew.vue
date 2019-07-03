<template>
    <App title="New Receipt" action="Save" @save="save">
        <AppForm :fields="receiptAppFields" :values="values" @mode="mode = $event" @final="setReceiptFields"></AppForm>
        <StackLayout v-if="mode === 'Cheque'">
            <AppForm :fields="chequeAppFields" @final="setReceiptFields"></AppForm>
        </StackLayout>
    </App>
</template>

<script>
    import { mapGetters,mapActions } from 'vuex';
    import {fetch_all_active_receipts} from "../../../assets/scripts/queries";
    const feMX = require('./../../../assets/scripts/mixins/formelement');

    export default {
        name: "ReceiptNew",
        mixins: [feMX.common, feMX.customer, feMX.paymentmode, feMX.store, feMX.fiscal, feMX.datepicker, feMX.amount, feMX.text],
        props: ['pMode'],
        data(){ return {
            receiptFields: { customer:'Customer',mode:'PaymentMode',store:'Store',fycode:'Fiscal',date:'DatePicker',amount:'Amount' },
            chequeFields: { bank:'Text',cheque:'Text',cheque_date:'DatePicker' },
            mode: 'Cash', final: {},
        }},
        computed: {
            ...mapGetters({ date:'date' }),
            values(){ return { date:this.date(),mode:this.mode } },
            receiptAppFields(){ return this.appFormFields(this.receiptFields) },
            chequeAppFields(){ let fields = this.appFormFields(this.chequeFields); return _.mapValues(fields,(field,name) => { field.label = _.startCase(name); return field; }) },
        },
        methods: {
            ...mapActions({ newReceipt:'Receipts/create',stock:'_stock' }),
            setReceiptFields(data){ this.final = Object.assign({},this.final,data) },
            save(){
                if(_.isEmpty(this.final.amount) && !_.isNumber(this.final.amount)) return alert('Please enter any amount');
                this.newReceipt(this.final).then(id => {
                    this.stock({ query:sql.format(fetch_all_active_receipts) });
                    this.$navigateTo(require('./ReceiptDetail').default,{ props:{ id }})
                });
            }
        },
        created() {
            this.mode = this.pMode || 'Cash'
        }
    }
</script>
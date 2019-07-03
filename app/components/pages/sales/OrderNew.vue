<template>
    <App title="New Sales Order" action="Proceed" @proceed="proceed">
        <AppForm :fields="appFormFields()" :values="values" @final="setSelectedData"></AppForm>
    </App>
</template>

<script>
    import { mapGetters } from 'vuex';
    const feMX = require('./../../../assets/scripts/mixins/formelement');

    export default {
        name: "OrderNew",
        mixins: [feMX.common,feMX.customer,feMX.fiscal,feMX.datepicker,feMX.payment],
        data(){ return {
            fieldLayout: { customer:'Customer',fycode:'Fiscal',date:'DatePicker',payment:'Payment' },
            final: {}
        }},
        computed: {
            ...mapGetters({ docno:'SalesOrder/docno',date:'datetime',_ref:'_ref',user:'user',setting:'Settings/setting' }),
            fncode(){ return this.setting('SALESORDERFNCODE'); },
            values(){ return { date:this.date() } }
        },
        methods: {
            setSelectedData(data){ this.final = Object.assign({},this.final,data); },
            proceed(){
                let { fycode,customer,date,payment } = this.final, docno = this.docno(this.fncode,fycode), _ref = this._ref();
                let master = { _ref,docno,customer,date,fycode,fncode:this.fncode,payment_type:payment,user:this.user,progress:'Incomplete' };
                this.$navigateTo(require('./OrderNewItems').default,{ props:{ master },backstackVisible:false })
            }
        }
    }
</script>
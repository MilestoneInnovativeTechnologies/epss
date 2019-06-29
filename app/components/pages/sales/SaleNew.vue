<template>
    <App title="New Sale" action="Proceed" @proceed="proceed">
        <AppForm :fields="appFormFields()" :values="values" @final="setSelectedData"></AppForm>
    </App>
</template>

<script>
    import { mapGetters } from 'vuex';
    const feMX = require('./../../../assets/scripts/mixins/formelement');

    export default {
        name: "SaleNew",
        mixins: [feMX.common,feMX.customer,feMX.store,feMX.salestype,feMX.fiscal,feMX.datepicker,feMX.payment,feMX.nature],
        data(){ return {
            fieldLayout: { customer:'Customer',store:'Store',type:'SalesType',fiscal:'Fiscal',date:'DatePicker',payment:'Payment' },
            final: {}
        }},
        computed: {
            ...mapGetters({ docno:'Sales/docno',_tableDataItem:'Fiscal/_tableDataItem',date:'date',_ref:'_ref' }),
            values(){ return { date:this.date() } }
        },
        methods: {
            setSelectedData(data){ this.final = Object.assign({},this.final,data); },
            proceed(){
                let { store,fiscal,type,customer,date,payment } = this.final, docno = this.docno(store,fiscal,type), _ref = this._ref();
                let fycode = _.get(this._tableDataItem('fiscalyearmaster',fiscal),'code') || '2019';
                let master = { _ref,docno,customer,date,fycode,fncode:type,payment_type:payment };
                this.$navigateTo(require('./SaleNewItems').default,{ props:{ master } })
            }
        }
    }
</script>
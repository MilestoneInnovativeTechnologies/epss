<template>
    <App title="New Sale" action="Proceed" @proceed="proceed">
        <AppForm :fields="appFormFields()" :values="values" @final="setSelectedData"></AppForm>
    </App>
</template>

<script>
    const feMX = require('./../../../assets/scripts/mixins/formelement');

    export default {
        name: "SaleNew",
        mixins: [feMX.common,feMX.customer,feMX.fiscal,feMX.datepicker,feMX.payment,feMX.salesorder,feMX.nature],
        data(){ return {
            fieldLayout: { customer:'Customer',fiscal:'Fiscal',date:'DatePicker',payment:'Payment',salesorder:'SalesOrder' },
            values: { date:moment().format('YYYY-MM-DD') },
            final: {}
        }},
        computed: {
        },
        methods: {
            setSelectedData(data){ this.final = Object.assign({},this.final,data); },
            proceed(){
                this.$navigateTo(require('./SaleNewItems').default,{ props:{'master':this.final} })
            }
        }
    }
</script>
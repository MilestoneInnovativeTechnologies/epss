<template>
    <App title="Cash Receipt">
<!--        <DevMsg></DevMsg>-->
        <AppForm :fields="fields" title="TEST FORM" :values="values" @date="customerChanged"></AppForm>
    </App>
</template>

<script>
    const feMX = require("../../../assets/scripts/mixins/formelement");

    export default {
        name: "CashReceiptIndex",
        data() { return {
            formFields: { customer:'Customer',fiscal:'Fiscal',date:'DatePicker' },
            value: {},
        }},
        mixins: [feMX.customer,feMX.fiscalyear,feMX.dataepicker],
        computed: {
            fields(){ return this.formFieldsToFields() },
        },
        methods: {
            customerChanged(v){ console.log('CV',v); },
            formFieldsToFields(){ return (_.isEmpty(this.formFields)) ? {} : _.mapValues(this.formFields,(mxn,name) => { return { ...(this['feField'+mxn]),name }}) }
        },
    }
</script>
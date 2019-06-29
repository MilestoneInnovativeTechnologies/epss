<template>
    <App title="Cash Receipt">
        <AppForm :fields="fields" title="TEST FORM" :values="values" @submit="formDataToTables"></AppForm>
    </App>
</template>

<script>
    import {mapActions} from 'vuex';
    const feMX = require("../../../assets/scripts/mixins/formelement");

    export default {
        name: "CashReceiptIndex",
        data() {
            return {
                formFields: {product: 'Product', nat: 'Nature', date: 'DatePicker', amount: 'Decimal', name: 'Text'},
                formBinds: {testtable: {fields: { t1:'product',t2:'date',t3:'amount',t4:'name',t5:'nat'}, method: '_insert', success: 'successMethod'}},
                values: {}, executedQuery:['TEST OK']
            }
        },
        mixins: [feMX.common, feMX.product, feMX.nature, feMX.datepicker, feMX.decimal, feMX.text],
        computed: {
            fields() {
                return this.appFormFields()
            },
        },
        methods: {
            ...mapActions(['_insert']),
            successMethod(){
                console.log('I am success method');
                console.log(this.executedQuery[0]);
                console.log('If TEST OK is printed, then this bind is proper');
                console.log('if executed query in printed, then binding to db');
                DB.get('testtable',null,function(){
                    console.log(this.result);
                    console.log('IF Array then data inserted successfully');
                })
            }
        }
    }
</script>
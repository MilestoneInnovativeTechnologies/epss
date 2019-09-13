<template>
    <AppForm :fields="appFormFields()" :values="values" @final="calculate"></AppForm>
</template>

<script>
    const feMX = require('./../../assets/scripts/mixins/formelement');

    export default {
        name: "CalculateDiscount",
        mixins: [feMX.common,feMX.discounttype],
        props: ['total'],
        data(){ return {
            fieldLayout: { type:'DiscountType',amount:'Text' },
            values: { type:'Amount',amount:'0' }
        }},
        methods: {
            calculate(data){
                console.log(_.cloneDeep(data));
                let total = _.toNumber(this.total), type = data.type || 'Amount', amount = _.toNumber(data.amount);
                if(type === 'Amount') this.$emit('discount',amount);
                this.$emit('discount',(total*amount/100));
            }
        }
    }
</script>
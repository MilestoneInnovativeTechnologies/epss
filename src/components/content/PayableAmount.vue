<template>
    <GridLayout columns="2*,3*">
        <StackLayout col="0">
            <AppInfoWideNumerical title="Sub Total" :text="toAmount(amount,true)" />
            <AppInfoWideNumerical title="Total Tax" :text="toRate(tax,true)" />
            <AppInfoWideNumerical title="Total Discount" :text="toRate(discount,true)" />
        </StackLayout>
        <AppInfoHighlight col="1" :text="toAmount(payable,true)" />
    </GridLayout>
</template>

<script>
    export default {
        name: "PayableAmount",
        props: ['amount','tax','discount'],
        computed: {
            payable(){ return _.toNumber(this.amount) + _.toNumber(this.tax) - _.toNumber(this.discount) }
        },
        methods: {
            toRate(number,str){ return __.rate(number,str); },
            toAmount(number,str){ return __.amount(number,str); }
        }
    }
</script>

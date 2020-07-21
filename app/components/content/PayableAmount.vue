<template>
    <GridLayout columns="*,*">
        <StackLayout col="1">
            <AppInfoWideNumerical title="Sub Total" :text="toAmount(amount)" />
            <AppInfoWideNumerical title="Total Tax" :text="toRate(tax)" />
            <AppInfoWideNumerical title="Total Discount" :text="toRate(discount)" />
        </StackLayout>
        <AppInfoHighlight col="0" title="AMOUNT PAYABLE" :text="toAmount(payable)" />
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
            toRate(number){ return __.rate(number); },
            toAmount(number){ return __.amount(number); }
        }
    }
</script>

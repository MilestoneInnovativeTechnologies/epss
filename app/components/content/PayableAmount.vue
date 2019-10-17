<template>
    <StackLayout>
        <AppInfoWideNumerical title="Sub Total" :text="toAmount(amount)"></AppInfoWideNumerical>
        <AppInfoWideNumerical title="Total Tax" :text="toRate(tax)"></AppInfoWideNumerical>
        <AppInfoWideNumerical title="Total Discount" :text="toRate(discount)"></AppInfoWideNumerical>
        <AppInfoHighlight title="AMOUNT PAYABLE" :text="toAmount(payable)"></AppInfoHighlight>
    </StackLayout>
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
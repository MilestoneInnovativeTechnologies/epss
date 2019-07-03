<template>
    <App title="Receipt Detail" action="Print Preview" @print-preview="$navigateTo(require('./ReceiptPreview').default,{ props:{ id }})">
        <StackLayout v-if="receipt">
            <TextTitle>{{ receipt.docno }}</TextTitle>
            <AppInfoWide title="mode">{{ receipt.mode }}</AppInfoWide>
            <AppInfoWide title="customer">{{ receipt.customer }}</AppInfoWide>
            <AppInfoWide title="date">{{ __.docdate(receipt.date) }}</AppInfoWide>
            <AppInfoWide title="executive">{{ receipt.executive }}</AppInfoWide>
            <AppInfoHighlight title="amount">{{ __.amount(receipt.amount) }}</AppInfoHighlight>
            <GridLayout columns="*,*,*" v-if="receipt.mode === 'Cheque'">
                <AppInfoWithLabel col="0" title="Bank">{{ receipt.bank }}</AppInfoWithLabel>
                <AppInfoWithLabel col="1" title="Cheque No">{{ receipt.cheque }}</AppInfoWithLabel>
                <AppInfoWithLabel col="2" title="Cheque Date">{{ __.chqdate(receipt.cheque_date) }}</AppInfoWithLabel>
            </GridLayout>
        </StackLayout>
        <StackLayout v-else>
            <TextHeading class="w-full text-center">NO DETAILS AVAILABLE</TextHeading>
        </StackLayout>
    </App>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "ReceiptDetail",
        props: ['id'],
        computed: {
            ...mapState('Receipts',{ receipts:'list' }),
            receipt(){ return this.receipts.filter(item => item.id === this.id)[0] },
            __(){ return __ }
        },
    }
</script>
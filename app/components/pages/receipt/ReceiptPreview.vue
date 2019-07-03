<template>
    <Preview title="Receipt Details" :template="template"></Preview>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "ReceiptPreview",
        props: ['id'],
        data(){ return {}},
        computed: {
            ...mapState('Receipts',{ receipts:'list' }),
            receipt(){ return this.receipts.filter(item => item.id === this.id)[0] },
            common(){ return _.zipObject(['Document no','Date','Customer','Executive'],[
                this.receipt.docno,__.docdate(this.receipt.date),this.receipt.customer,this.receipt.executive
            ])},
            cheque(){ return (this.receipt.mode === 'Cheque') ? _.zipObject(['Bank','Cheque','Cheque Date'],[
                this.receipt.bank,this.receipt.cheque,__.chqdate(this.receipt.cheque_date)
            ]) : {} },
            template(){ return [
                ['wide',{ items:this.common }],
                ['wideItem',{ title:'Amount',text:__.amount(this.receipt.amount),display:true }],
                ['wideItem',{ title:'Payment Mode',text:this.receipt.mode }],
                ['wide',{ items:this.cheque }],
            ]},
        }

    }
</script>
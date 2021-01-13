<template>
    <App title="Receipt Detail" action="Print" @print="printout">
        <TextTitle :text="receipt.docno" class="m-b-30"></TextTitle>
        <AppInfoWide v-for="(field,title,idx) in infoWide" class="m-b-10" :title="title" :text="receipt[field]" :key="'rd-iw-'+idx"></AppInfoWide>
        <AppInfoHighlight title="AMOUNT" :text="receipt.amount | amount"></AppInfoHighlight>
        <GridLayout columns="*,*,*" rows="auto" v-if="receipt.cheque" class="m-t-30">
            <AppInfoWithLabel v-for="(field,title,idx) in infoLabel" :col="idx" :title="title" :text="receipt[field]" :key="'rd-il-'+idx"></AppInfoWithLabel>
        </GridLayout>
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../../assets/scripts/mixins/ccachedata";
    import {FnPrint} from "../../../assets/scripts/mixins/fnprint";
    const infoWide = { Customer:'customer',Date:'date',Executive:'executive' };
    const infoLabel = { Bank:'bank',Date:'cheque_date',Cheque:'cheque' };

    export default {
        name: "ReceiptDetail",
        mixins: [CCacheDataMixin,FnPrint],
        props: ['id'],
        computed: {
            receipt(){ return _.get(this.receipts,this.id,{}) },
            infoWide(){ return infoWide },
            infoLabel(){ return infoLabel },
            amount(){ return __.amount(this.receipt.amount) },
            fncode(){ return this.receipt.fncode },
        },
        methods: {
            printout(){ this.FnPrint({ _ref:this.id }) },
        },
        created(){ this.CCacheDataPrepare({ table:'receipts',method:'dataById' }) },
    }
</script>

<template>
    <App title="Transaction Detail" action="Print" @print="printout">
        <StackLayout v-if="master">
            <TextTitle :text="master.docno"></TextTitle>
            <TextHeading :text="master.customer" class="m-b-20"></TextHeading>
            <AppInfoWide v-for="(field,title,idx) in infoWide" class="m-b-4" :title="title" :text="master[field]" :key="'td-iw-'+idx"></AppInfoWide>
            <AppList :source="details" :layout="layout" :cast="cast" title="Products" class="m-t-20"></AppList>
            <GridLayout columns="*,*,*" rows="auto" v-if="details" class="m-t-30">
                <AppInfoWithLabel v-for="(field,title,idx) in infoLabel" :col="idx" :title="title" :text="getSum(field) | amount" :key="'td-il-'+idx"></AppInfoWithLabel>
            </GridLayout>
            <AppInfoHighlight title="AMOUNT" :text="getSum('amount') | amount"></AppInfoHighlight>
        </StackLayout>
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../../assets/scripts/mixins/ccachedata";
    import {FnPrint} from "../../../assets/scripts/mixins/fnprint";
    const infoWide = { Date:'date',Store:'store',Executive:'executive' };
    const infoLabel = { Amount:'amount',Tax:'tax',Discount:'discount' };
    const layout = { Product:'product',Quantity:'quantity',Amount:'amount',Rate:'rate',Tax:'tax_rate',Discount:'discount' };
    const cast = { quantity:'quantity',amount:'amount',rate:'rate',tax:'rate',discount:'amount' };

    export default {
        name: "TransactionDetail",
        mixins: [CCacheDataMixin,FnPrint],
        props: ['id'],
        data(){ return { transactions:{},infoWide,infoLabel,layout,cast } },
        computed: {
            details(){ return _.map(_.get(this.transactions,this.id),detail => Object.assign({},detail, { amount:this.getTotalCalculated(detail),discount:this.getTotalDiscount(detail),tax_rate:this.getTaxRate(detail) })) },
            master(){ return _.head(this.details) },
            fncode(){ return this.master['fncode'] },
            total(){ return _.sumBy(this.details,'amount') }
        },
        methods: {
            printout(){ this.FnPrint({ _ref:this.id }) },
            getTotalCalculated({ quantity,rate,tax,discount01,discount02 }){
                return _.toNumber(quantity) * _.toNumber(rate) + _.toNumber(tax) - _.toNumber(discount01) - _.toNumber(discount02);
            },
            getTotalDiscount({ discount01,discount02 }){ return _.toNumber(discount01) + _.toNumber(discount02); },
            getTaxRate({ quantity,rate,tax }){ return (_.toNumber(tax) * 100) / (_.toNumber(quantity) * _.toNumber(rate)); },
            getSum(field){ return _.sumBy(this.details,detail => _.toNumber(detail[field]) ) }
        },
        created(){ this.CCacheDataPrepare({ table:'transactions',method:'dataByGroup',args:'id' }) },
    }
</script>

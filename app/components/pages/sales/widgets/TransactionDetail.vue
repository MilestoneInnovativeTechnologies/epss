<template>
    <StackLayout v-if="transaction">
        <TextTitle>{{ transaction.docno }}</TextTitle>
        <TextTitleSub class="m-b-15">{{ transaction.customer }}</TextTitleSub>
        <AppInfoWide title="date">{{ docdate(transaction.date) }}</AppInfoWide>
        <AppInfoWide title="executive" class="m-b-15">{{ transaction.executive }}</AppInfoWide>
        <AppList :source="source" :layout="layout" title="Products"></AppList>
        <GridLayout rows="auto" columns="*,*,*" class="m-t-15">
            <AppInfoWithLabel row="0" col="0" title="TAX">{{ round(sum('tax')) }}</AppInfoWithLabel>
            <AppInfoWithLabel row="0" col="1" title="DISCOUNT">{{ round(sum('discount')) }}</AppInfoWithLabel>
            <AppInfoWithLabel row="0" col="2" title="AMOUNT">{{ round(sum('total')) }}</AppInfoWithLabel>
        </GridLayout>
        <AppInfoHighlight title="payable amount" class="m-t-20">{{ round(sum('total')) }}</AppInfoHighlight>
    </StackLayout>
    <StackLayout v-else>
        <TextHeading width="100%" class="text-center">No details</TextHeading>
    </StackLayout>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {TransactionQueryBuilder} from "./../../../../assets/scripts/services/transactionquery";
    export default {
        name: "TransactionDetail",
        props: ['id','trType','fields','layout','cast'],
        data(){ return {
            cacheOn: 0,
        }},
        computed: {
            ...mapState('Transaction',['detail']),
            transactionDetail(){ return this.detail[this.id] }, transaction(){ return this.transactionDetail[0] },
            source(){ return _.isNil(this.cast) ? this.transactionDetail : __.cast(this.transactionDetail,this.cast); },
            sum(){ return (field) => _.sum(_.map(this.transactionDetail,(item) => _.toNumber(item[field]))) },
        },
        methods: {
            ...mapActions('Transaction',['_stockIfNot']),
            docdate(date){ return __.docdate(date) },
            round(number){ return __.amount(number).toFixed(__.AMOUNT_DECIMAL) },
        },
        created() {
            let query = new TransactionQueryBuilder(this.trType).fields(this.fields).where({ id:this.id }).query();
            this._stockIfNot({ query:this.query,key:'detail',path:this.id,on:this.cacheOn })
        }
    }
</script>
<template>
    <StackLayout>
        <TextTitle>{{ transaction.docno }}</TextTitle>
        <TextTitleSub class="m-b-15">{{ transaction.customer }}</TextTitleSub>
        <AppInfoWide title="date">{{ docdate(transaction.date) }}</AppInfoWide>
        <AppInfoWide title="executive" class="m-b-15">{{ transaction.executive }}</AppInfoWide>
        <AppList :source="source" :layout="productListLayout" title="Products"></AppList>
        <GridLayout rows="auto" columns="*,*,*" class="m-t-15">
            <AppInfoWithLabel row="0" col="0" title="TAX">{{ (sum('tax')) }}</AppInfoWithLabel>
            <AppInfoWithLabel row="0" col="1" title="DISCOUNT">{{ (sum('discount')) }}</AppInfoWithLabel>
            <AppInfoWithLabel row="0" col="2" title="AMOUNT">{{ (sum('total')) }}</AppInfoWithLabel>
        </GridLayout>
        <AppInfoHighlight title="payable amount" class="m-t-20">{{ (sum('total')) }}</AppInfoHighlight>
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
            productListLayout(){ return _.mapKeys(this.layout,(item) => _.capitalize(item)) },
            source(){ if(_.isNil(this.cast)) return this.transactionDetail; let cast = this.cast, castKeys = _.keys(cast); return _.map(this.transactionDetail,(detail) => _.mapValues(detail,(value, name) => _.includes(castKeys,name) ? __[cast[name]](value) : value) ) },
            sum(){ return (field) => _.sum(_.map(this.transactionDetail,(item) => _.toNumber(item[field]))) },
            docdate(){ return (date) => __.docdate(date) }, round(){ return (num) => (__.amount(num)).toFixed(__.AMOUNT_DECIMAL) }
        },
        methods: {
            ...mapActions('Transaction',['_stockIfNot'])
        },
        created() {
            let query = new TransactionQueryBuilder(this.trType).fields(this.fields).where({ id:this.id }).query();
            this._stockIfNot({ query,key:'detail',path:this.id,on:this.cacheOn })
        }
    }
</script>
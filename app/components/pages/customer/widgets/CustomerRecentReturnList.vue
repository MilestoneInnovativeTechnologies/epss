<template>
    <AppList :source="source" :limit="limit" :layout="layout" :title="title" detail="sales/SaleReturnDetail"></AppList>
</template>

<script>
    import { mapActions,mapGetters } from 'vuex';
    import {TransactionQueryBuilder} from "../../../../assets/scripts/services/transactionquery";

    export default {
        name: "CustomerRecentReturnList",
        props: ['id','limit','title'],
        data(){ return {
            fields: ['id','docno','date','total'],
            layout: { 'DOC NO':'docno',Date:'date',Total:'total' },
            cast: { date:'docdate',total:'amount' }
        }},
        computed:{
            ...mapGetters('Sales',['_stateDataByGroup']),
            dbData(){ return this._stateDataByGroup('customerReturnSummary.'+this.id,'id')},
            formatted(){ return _.map(this.dbData,(itemsArray) => { return this.getItemObj(itemsArray) }) },
            source(){ return __.cast(this.formatted,this.cast); },
            query(){ return new TransactionQueryBuilder('SR').fields(this.fields).where({ cid:this.id }).max(15).query(); }
        },
        methods: {
            ...mapActions('Sales',['_stockIfNot']),
            getItemObj(array){ let first = _.head(array); return _.zipObject(this.fields,[first.id,first.docno,first.date,this.getSumTotal(array)]); },
            getSumTotal(array){ return _.sum(_.map(array,(item) => _.toNumber(item.total))) }
        },
        created() {
            this._stockIfNot({ query:this.query,key:'customerReturnSummary',path:this.id });
        }
    }
</script>
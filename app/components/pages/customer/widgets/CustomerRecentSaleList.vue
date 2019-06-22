<template>
    <AppList :source="source" :limit="limit" :layout="layout" :title="title" detail="sales/SaleDetail"></AppList>
</template>

<script>
    import { mapActions,mapGetters } from 'vuex';
    import {TransactionQueryBuilder} from "../../../../assets/scripts/services/transactionquery";

    export default {
        name: "CustomerRecentSaleList",
        props: ['id','limit','title'],
        data(){ return {
            fields: ['id','docno','date','total'],
            layout: { 'DOC NO':'docno',Date:'date',Total:'total' },
            cast: { date:'docdate',total:'amount' }
        }},
        computed:{
            ...mapGetters('Sales',['_stateDataByGroup']),
            dbData(){ return this._stateDataByGroup('customerSaleSummary.'+this.id,'id')},
            formatted(){ return _.map(this.dbData,(itemsArray) => { return this.getItemObj(itemsArray) }) },
            source(){ return __.cast(this.formatted,this.cast); },
            query(){ return new TransactionQueryBuilder('SL').fields(this.fields).where({ cid:this.id }).max(15).query(); }
        },
        methods: {
            ...mapActions('Sales',['_stockIfNot']),
            getItemObj(array){ let first = _.head(array); return _.zipObject(this.fields,[first.id,first.docno,first.date,this.getSumTotal(array)]); },
            getSumTotal(array){ return _.sum(_.map(array,(item) => _.toNumber(item.total))) }
        },
        created() {
            this._stockIfNot({ query:this.query,key:'customerSaleSummary',path:this.id });
        }
    }
</script>
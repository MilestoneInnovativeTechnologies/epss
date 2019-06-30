<template>
    <Preview title="Sales Details" :template="template"></Preview>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {TransactionQueryBuilder} from "../../../assets/scripts/services/transactionquery";

    export default {
        name: "SalePreview",
        props: ['id'],
        data(){ return {
            trType: 'SL',
            fields: [ 'docno','date','customer','executive','total','tax','discount','product','quantity','amount','rate','taxRate','pid' ],
        }},
        computed: {
            ...mapState('Transaction',['detail']),
            transactionDetail(){ return this.detail[this.id] }, transaction(){ return this.transactionDetail[0] },
            template(){ return [
                ['distributed',{ items:this.masterItems }],
                ['table',{ layout:this.tableLayout,items:this.tableItems }],
                ['wideItem',{ title:'sub total',text:__.amount(this.subTotal),big:'true' }],
                ['wideItem',{ title:'discount',text:__.amount(this.discount),small:'true' }],
                ['line',{ height:3 }],
                ['wideItem',{ title:'total amount',text:__.amount(this.subTotal+this.discount),display:'true' }],
            ]},
            masterItems(){
                let T = this.transaction;
                return _.zipObject(['document no','date','customer','executive'],[
                    T.docno, __.docdate(T.date), T.customer, T.executive
                ])
            },
            tableLayout(){
                return _.fromPairs([['Particulars','particulars'],['Quantity','quantity'],['Rate','rate'],['Tax','tax'],['Total','total']])
            },
            tableItems(){
                return _.map(this.transactionDetail,(detail) => {
                    return _.zipObject(['particulars','quantity','rate','tax','total'],[
                        this.getParticulars(detail),__.quantity(detail.quantity),__.rate(_.get(detail,'rate')),__.rate(_.get(detail,'tax')),__.amount(_.get(detail,'total'))
                    ])
                })
            },
            subTotal(){
                return _.sum(_.map(this.transactionDetail,(trnDet) => _.toNumber(trnDet.total)))
            },
            discount(){
                return _.sum(_.map(this.transactionDetail,(trnDet) => _.toNumber(trnDet.discount)))
            },
        },
        methods: {
            ...mapActions('Transaction',['_stockIfNot']),
            getParticulars(detail){
                return `${detail.product}\n@${detail.taxRate}`
            }
        },
        created() {
            let query = new TransactionQueryBuilder(this.trType).fields(this.fields).where({ id:this.id }).query();
            this._stockIfNot({ query,key:'detail',path:this.id })
        }

    }
</script>
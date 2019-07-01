<template>
    <Preview title="Sales Order Details" :template="template"></Preview>
</template>

<script>
    import { mapState,mapActions } from 'vuex';

    export default {
        name: "OrderPreview",
        props: ['id'],
        data(){ return {
            masterFields: ['docno','date','customer','executive'],
            tableLayout: { Product:'product',Quantity:'quantity',Rate:'rate',Tax:'tax',Total:'total' },
        }},
        computed: {
            ...mapState('SalesOrder',['list','products']),
            detail(){ return this.list[_.findKey(this.list,['id',this.id])] }, orderItems(){ return this.products[this.id] },
            template(){ return [
                ['distributed',{ items:_.pick(this.detail,this.masterFields) }],
                ['table',{ layout:this.tableLayout,items:this.tableItems }],
                ['wideItem',{ title:'sub total',text:__.amount(this.getSum('total')),big:'true' }],
                ['wideItem',{ title:'discount',text:'0.00',small:'true' }],
                ['line',{ height:3 }],
                ['wideItem',{ title:'total amount',text:__.amount(this.getSum('total')),display:'true' }],
            ]},
            tableItems(){
                return _.map(this.orderItems,(item) => {
                    return _.zipObject(['product','quantity','rate','tax','total'],[
                        item.product,__.quantity(item.quantity),__.rate(_.get(item,'rate')),__.rate(_.get(item,'tax')),__.amount(_.get(item,'total'))
                    ])
                })
            },
        },
        methods: {
            ...mapActions('Transaction',['_stockIfNot']),
            getSum(field){ return _.sum(_.map(this.orderItems,item => _.toNumber(item[field]))) },
        }

    }
</script>
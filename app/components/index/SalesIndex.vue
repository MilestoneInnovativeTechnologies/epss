<template>
    <App :title="title" action="Create New" @create-new="createNew">
        <TransactionList :transactions="transactions" :limit="10" :title="'Recent ' + title" class="m-t-15"></TransactionList>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {TransactionQueryBuilder} from "../../assets/scripts/services/transactionquery";
    import {WideScreenCheck} from "../../assets/scripts/mixins/widescreencheck";
    import {ThisObj} from "../../assets/scripts/mixins/tobj";
    import {NewSaleTransaction, NewSaleTransactionAdvanced} from "../../assets/scripts/navigations";

    const constants = { limit: 30, after: 3, on: 3 };
    const fetchFields = ['docno','fycode','fncode','customer','date','store','cid','sid','id','eid','executive'];

    export default {
        name: "SalesIndex",
        mixins: [ThisObj,WideScreenCheck],
        props: ['fycode','fncode','store'],
        data(){ return { } },
        computed: {
            ...mapState('Transaction',['recent']), ...mapState('Menu',['content']),
            transactions(){ return this.recent[this.fncode] },
            title(){ return _.get(_.filter(this.content,(itm) => itm.fncode === this.fncode),'0.name') }
        },
        methods: {
            ...mapActions('Transaction',{ stockTransaction:'_stockIfNot' }),
            doStock(){
                let query = new TransactionQueryBuilder(constants.limit)
                    .fields(fetchFields)
                    .where(this.TO_Get(['sid','fycode','fncode'],{ sid:'store' }))
                    .query();
                this.stockTransaction({ query,key:'recent',path:this.fncode,on:constants.on });
            },
            createNew(){
                let navComponent = this.WSC_isWide ? NewSaleTransactionAdvanced : NewSaleTransaction;
                this.$navigateTo(navComponent,{ props:this.TO_Get(['store','fycode','fncode','title']) });
            }
        },
        created() {
            if(!this.recent[this.fncode] || _.isEmpty(this.recent[this.fncode])) this.doStock();
            else setTimeout(() => this.doStock(),constants.after * 1000);
        }

    }
</script>
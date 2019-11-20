<template>
    <App :title="title" action="Create New" @create-new="createNew">
        <TransactionList :transactions="transactions" :limit="10" :title="'Recent ' + title" class="m-t-15"></TransactionList>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {WideScreenCheck} from "../../assets/scripts/mixins/widescreencheck";
    import {ThisObj} from "../../assets/scripts/mixins/tobj";
    import {NewSaleTransaction, NewSaleTransactionAdvanced} from "../../assets/scripts/navigations";
    import {recent_sale_transactions} from "../../assets/scripts/queries";

    const constants = { limit: 30, after: 3, on: 3 };

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
                this.stockTransaction({ query:sql.format(recent_sale_transactions,[this.store,this.fycode,this.fncode,constants.limit]),key:'recent',path:this.fncode,on:constants.on });
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
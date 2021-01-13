<template>
    <App :title="title" action="Add New Return" @add-new-return="createNew">
        <TransactionList :transactions="transactions" :limit="10" :title="'Recent ' + title" class="m-t-15"></TransactionList>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {TransactionQueryBuilder} from "../../assets/scripts/services/transactionquery";
	const timer = require('@nativescript/core/timer');

    export default {
        name: "SalesReturnIndex",
        props: ['fycode','fncode','store'],
        data(){ return {
            limit: 30,
            after: 3,
            on: 3,
            fields: ['docno','fycode','fncode','customer','date','store','cid','sid','id','eid','executive'],
        } },
        computed: {
            ...mapState('Transaction',['recent']), ...mapState('Menu',['content']),
            transactions(){ return this.recent[this.fncode] },
            title(){ return _.get(_.filter(this.content,(itm) => itm.fncode === this.fncode),'0.name') }
        },
        methods: {
            ...mapActions('Transaction',{ stockTransaction:'_stockIfNot' }),
            doStock(){
                let query = new TransactionQueryBuilder(this.limit).fields(this.fields).where({ 'sid':this.store,'fycode':this.fycode,'fncode':this.fncode }).query();
                this.stockTransaction({ query:query,key:'recent',path:this.fncode,on:this.on });
            },
            createNew(){
                console.log('CREATE NEW',this.fncode,this.fycode,this.store);
            }
        },
        created() {
            if(!this.recent[this.fncode] || _.isEmpty(this.recent[this.fncode])) this.doStock();
            else timer.setTimeout(() => this.doStock(),this.after * 1000);
        }

    }
</script>
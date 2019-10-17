<template>
    <App :title="title" action="Create New" @create-new="createNew">
        <ReceiptList :receipts="receipts" :limit="10" :title="'Recent ' + title" class="m-t-15"></ReceiptList>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {fetch_recent_receipts} from "../../assets/scripts/queries";
    const { ReceiptNew } = require('./../../assets/scripts/navigations');
    const ThisOBJ = require('./../../assets/scripts/mixins/tobj').ThisObj;

    export default {
        name: "ReceiptIndex",
        mixins: [ThisOBJ],
        props: ['fycode','fncode','store'],
        data(){ return {
            limit: 30,
            after: 3,
            on: 3,
        } },
        computed: {
            ...mapState('Receipts',['recent']), ...mapState('Menu',['content']),
            receipts(){ return this.recent[this.fncode] },
            title(){ return _.get(_.filter(this.content,(itm) => itm.fncode === this.fncode),'0.name') },
        },
        methods: {
            ...mapActions('Receipts',{ stockReceipt:'_stockIfNot' }),
            doStock(){ this.stockReceipt({ query:sql.format(fetch_recent_receipts,[this.fycode,this.store,this.fncode,this.limit]),key:'recent',path:this.fncode,on:this.on }) },
            createNew(){ this.$navigateTo(ReceiptNew,{ props:this.TO_Get(['store','fycode','fncode','title']) }) }
        },
        created() {
            if(!this.recent[this.fncode] || _.isEmpty(this.recent[this.fncode])) this.doStock();
            else setTimeout(() => this.doStock(),this.after * 1000);
        }
    }
</script>
<template>
    <StackLayout>
        <TextTitleSub class="m-t-15">Pending Material Transfers</TextTitleSub>
        <AppList :source="pending[store]" :layout="layout()" action="pick" @collection="$emit('selected',$event)"></AppList>
    </StackLayout>
</template>

<script>
    import {fetch_all_pending_transfer_outs} from "../../../assets/scripts/queries";
    import { mapState,mapActions } from 'vuex';

    const constants = { limit:10, after:3 };
    const layout = { 'Doc No':'docno','Source Store':'store',Date:'date' };

    export default {
        name: "IndexStockTransferIn",
        props: ['fycode','store'],
        data(){ return {
            fncode:'MT1',
        } },
        computed: {
            ...mapState('Transfer',['pending','stock']),
        },
        methods: {
            ...mapActions('Transfer',{ stockTransfer:'_stock' }),
            doStockList(query,key,path){ this.stockTransfer({ query,key,path }); },
            layout(){ return layout },
        },
        created() {
            let query = sql.format(fetch_all_pending_transfer_outs,[this.store,this.fycode,this.fncode]);
            if(!this.pending[this.store] || _.isEmpty(this.pending[this.store])) this.doStockList(query,'pending',this.store);
            else setTimeout(() => this.doStockList(query),constants.after * 1000);
        }
    }
</script>
<template>
    <StackLayout>
        <TextTitleSub class="m-t-15">Pending Material Transfers</TextTitleSub>
        <AppList :source="pending" :layout="layout()" action="pick" @collection="$emit('selected',$event)"></AppList>
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
            doStockList(query,key){ this.stockTransfer({ query,key }); },
            layout(){ return layout },
        },
        created() {
            let query = fetch_all_pending_transfer_outs;
            if(!this.pending || _.isEmpty(this.pending)) this.doStockList(query,'pending');
            else setTimeout(() => this.doStockList(query,'pending'),constants.after * 1000);
        }
    }
</script>
<template>
    <App :title="title" :action="action" @save-transfer-out="saveTransferOut" @proceed-to-transfer-in="proceedTransferIn">
        <StackLayout v-if="fncode === 'MT1'">
            <TextTitleSub class="m-t-15">Pending Material Transfers</TextTitleSub>
            <AppList :source="getList" :layout="inLayout()" action="pick" @collection="inSelected = $event"></AppList>
        </StackLayout>
        <StackLayout v-else>
            <TextTitleSub class="m-t-15">Recent Transfer Outs</TextTitleSub>
            <AppList :source="getList" :layout="outLayout()"></AppList>
            <AppList class="m-t-20" :title="newOutListTitle()" :source="getOutAbleStockList" :layout="newOutListLayout()" @collection="selectedItems = $event" action="select"></AppList>
        </StackLayout>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {fetch_all_pending_transfer_outs, fetch_all_recent_transfer_outs, fetch_current_stock_list_of_a_store} from "../../assets/scripts/queries";

    const constants = { limit:10, after:3, outListFetchAfter:3 };
    const inLayout = { 'Doc No':'docno','Source Store':'store',Date:'date' };
    const outLayout = { 'Doc No':'docno','Date':'date','Status':'status' };
    const newOutListTitle = 'Select items for new transfer out';
    const newOutListLayout = { Item:'name',Stock:'stock','Out Quantity':'quantity'  };

    export default {
        name: "MaterialTransferIndex",
        props: ['fycode','fncode','store'],
        data(){ return {
            selectedItems: [],
            inSelected: [],
        } },
        computed: {
            ...mapState('Transfer',['list','stock']), ...mapState('Menu',['content']),
            action(){ return (this.fncode === 'MT2') ? 'Save Transfer Out' : 'Proceed to Transfer IN' },
            title(){ return _.get(_.filter(this.content,(itm) => itm.fncode === this.fncode),'0.name') },
            getList(){ return this.list[this.store] || [] },
            getOutAbleStockList(){ return (this.stock && this.stock[this.store]) ? _.filter(this.stock[this.store],list => _.toNumber(list.stock) > 0) : []; }
        },
        methods: {
            ...mapActions('Transfer',{ stockTransfer:'_stock' }),
            doStockList(query,key,path){ this.stockTransfer({ query:query,key,path }); },
            inLayout(){ return inLayout }, outLayout(){ return outLayout },
            newOutListTitle(){ return newOutListTitle },
            newOutListLayout(){ return newOutListLayout },

            saveTransferOut(){
                confirm({ title:'Are you sure?',message:'You are about to do Stock Transfer Out. Please confirm',okButtonText:'Confirmed, Do Transfer',cancelButtonText:'Cancel' })
                    .then(result => alert('The page is still under construction!'));
            },
            proceedTransferIn(){
                alert('The page is still under construction!');
            }

        },
        created() {
            let query = sql.format((this.fncode === 'MT2') ? fetch_all_recent_transfer_outs : fetch_all_pending_transfer_outs,[this.store,this.fycode,this.fncode]);
            if(!this.list[this.store] || _.isEmpty(this.list[this.store])) this.doStockList(query,'list',this.store);
            else setTimeout(() => this.doStockList(query),constants.after * 1000);
            if(this.fncode === 'MT2'){
                let Q1 = sql.format(fetch_current_stock_list_of_a_store,[this.store]);
                setTimeout(() => this.doStockList(Q1,'stock',this.store),constants.outListFetchAfter * 1000);
            }
        }
    }
</script>
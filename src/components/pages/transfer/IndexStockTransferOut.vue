<template>
    <StackLayout>
        <TextTitleSub class="m-t-15">Recent Transfer Outs</TextTitleSub>
        <AppList :source="recent[store]" :layout="recentLayout()"></AppList>
        <AppList class="m-t-20" :title="newList().title" :source="stockList()" :layout="newList().layout" :updates="newList().updates" @collection="$emit('selected',$event)" action="select"></AppList>
    </StackLayout>
</template>

<script>
    import {fetch_all_recent_transfer_outs, fetch_current_stock_list_of_a_store} from "../../../assets/scripts/queries";
    import { mapState,mapActions } from 'vuex';

    const constants = { limit:10, after:3 };
    const recentLayout = { 'Doc No':'docno','Date':'date','Status':'status' };
    const newTitle = 'Select items for new transfer out';
    const newLayout = { Item:'name',Stock:'stock','Out Quantity':'quantity'  };
    const newUpdates = { quantity:{ type:'Number', title:'Set new out quantity', action:'Update quantity' } };
	const timer = require('@nativescript/core/timer');

    export default {
        name: "IndexStockTransferOut",
        props: ['store','fycode'],
        data(){ return {
            fncode: 'MT2',
        } },
        computed: {
            ...mapState('Transfer',['recent','stock']),
        },
        methods: {
            ...mapActions('Transfer',{ stockTransfer:'_stock' }),
            doStockList(query,key,path){ this.stockTransfer({ query,key,path }); },
            stockList(){ return (this.stock && this.stock[this.store]) ? _.map(this.stock[this.store],details => details.quantity < 1 ? _.set(details,'quantity',0) : details) : []; },
            recentLayout(){ return recentLayout; },
            newList(){ return { layout:newLayout,title:newTitle,updates:newUpdates } },
        },
        created() {
            let query = sql.format(fetch_all_recent_transfer_outs,[this.store,this.fycode,this.fncode]);
            if(!this.recent[this.store] || _.isEmpty(this.recent[this.store])) this.doStockList(query,'recent',this.store);
            else timer.setTimeout(() => this.doStockList(query,'recent',this.store),constants.after * 1000);
            let Q1 = sql.format(fetch_current_stock_list_of_a_store,[this.store]);
            timer.setTimeout(() => this.doStockList(Q1,'stock',this.store),constants.after * 1000);
        }
    }
</script>
<template>
    <App :title="title" :action="action" @save-transfer-out="saveTransferOut" @view-products="proceedViewTransferInItems">
        <IndexStockTransferIn v-if="fncode === 'MT1'" :store="store" :fycode="fycode" @selected="selectedItems = $event"></IndexStockTransferIn>
        <IndexStockTransferOut v-else :store="store" :fycode="fycode" @selected="selectedItems = $event" :key="'ISTO-'+updates"></IndexStockTransferOut>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {ProductSale} from "../../assets/scripts/mixins/productsale";
    import {TransactionPack} from "../../assets/scripts/mixins/transactionpack";
    import {StockTransferInItems} from "../../assets/scripts/navigations";
    const DBTransaction = require("../../assets/scripts/services/DBTransaction").DBTransaction;

    export default {
        name: "MaterialTransferIndex",
        mixins: [ProductSale,TransactionPack],
        props: ['fycode','fncode','store'],
        data(){ return {
            selectedItems: [],
            updates: 0,
        } },
        computed: {
            ...mapState('Menu',['content']),
            action(){ return (this.fncode === 'MT2') ? 'Save Transfer Out' : 'View Products' },
            title(){ return _.get(_.filter(this.content,(itm) => itm.fncode === this.fncode),'0.name') },
        },
        methods: {
            ...mapActions('Transfer',{ saveMaterialTransferOut:'out' }),
            async saveTransferOut(){
                if(this.selectedItems.length < 1) return alert({ title: "Attention", message: "Please select any products to do stock transfer out", okButtonText: "Proceed" });
                this.PS_items = []; this.selectedItems.map((item) => this.PS_AddItem(item.pid,item.quantity));
                let outData = new DBTransaction(this.TP).prepare(this.PS_items);
                let result = await confirm({ title:'Are you sure?',message:'You are about to do Stock Transfer Out. Please confirm',okButtonText:'Confirmed, Do Transfer',cancelButtonText:'Cancel' });
                if(!result) return;
                let docno = await this.saveMaterialTransferOut(outData);
                alert({ title: "Success!!", message: "Material Transfer Out has done.\nDocument No: "+docno, okButtonText: "Proceed" });
                this.updates++;
            },
            proceedViewTransferInItems(){
                if(this.selectedItems.length < 1) return alert({ title: "Attention", message: "Please select any pending stock transfer out to do stock transfer in", okButtonText: "Proceed" });
                let id = this.selectedItems[0].id;
                this.$navigateTo(StockTransferInItems,{ props:{ id,store:this.store,fycode:this.fycode } });
            }
        }
    }
</script>
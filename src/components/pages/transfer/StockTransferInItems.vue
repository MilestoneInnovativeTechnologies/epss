<template>
    <App title="Stock Transfer IN - Items" :key="'STII-'+updates" action="Do Stock Transfer In" @do-stock-transfer-in="doStockTransferIn">
        <AppInfoWide title="DOCNO" :text="details[0].docno"></AppInfoWide>
        <AppInfoWide title="DATE" :text="details[0].date"></AppInfoWide>
        <AppInfoWide title="STORE" :text="details[0].store"></AppInfoWide>
        <AppInfoWide title="USER" :text="details[0].executive"></AppInfoWide>
        <AppList :source="source" v-bind="extras" @collection="selectedItems = $event"></AppList>
    </App>
</template>

<script>
    import {mapState,mapActions} from 'vuex';
    import {TransactionPack} from "../../../assets/scripts/mixins/transactionpack";
    import {ProductSale} from "../../../assets/scripts/mixins/productsale";
    import {Home} from "../../../assets/scripts/navigations";
    import {FnPrint} from "../../../assets/scripts/mixins/fnprint";
    import {fetch_a_transaction_detail} from "../../../assets/scripts/queries";
    const DBTransaction = require("../../../assets/scripts/services/DBTransaction").DBTransaction;

    const TransactionQueryBuilder = require('./../../../assets/scripts/services/transactionquery').TransactionQueryBuilder,
        fields = ['docno','date','store','fycode','product','quantity','pid','executive'],
        sFields = ['product','pid','quantity'],
        layout = { Product:'product', 'Out Quantity':'oQuantity', 'In Quantity':'quantity' },
        updates = { quantity:{ type:'Number',action:'Update IN Quantity',title:'Actual IN Quantity' } };

    export default {
        name: "StockTransferInItems",
        mixins: [ProductSale,TransactionPack, FnPrint],
        props: ['id','store','fycode'],
        data(){ return {
            selectedItems: [],
            fncode: 'MT1', payment_type: 'Credit',
            updates: 0,
        } },
        computed: {
            ...mapState('Transaction',['detail']),
            details(){ return this.detail[this.id] || [{}] },
            source(){ return _.map(this.details,(item) => { return { ...(_.pick(item, sFields)),'oQuantity':item.quantity } }) },
            extras(){ return { layout,updates,action:'select' } }
        },
        methods: {
            ...mapActions({ doStock:'Transaction/_stock',saveMaterialTransferIn:'Transfer/saveIn' }),
            doStockDetail(query,key,path){ this.doStock({ query,key,path }); },
            async doStockTransferIn(){
                if(this.selectedItems.length < 1) return alert({ title: "Attention", message: "Please select any products to do Stock Transfer IN", okButtonText: "Proceed" });
                this.PS_items = []; this.selectedItems.map((item) => this.PS_AddItem(item.pid,item.quantity));
                let data = { ...(new DBTransaction(this.TP).prepare(this.PS_items)),out:this.id };
                let result = await confirm({ title:'Are you sure?',message:'You are about to do a Stock Transfer IN. Please confirm',okButtonText:'Confirmed, Do Transfer',cancelButtonText:'Cancel' });
                if(!result) return;
                let { docno,_ref } = await this.saveMaterialTransferIn(data), vm = this;
                confirm({ title:'Material Transfer In has done',message:'Document No: ' + docno + "\nDo you want to print?",cancelButtonText:'Print and Proceed',okButtonText:'Proceed without Print' })
                    .then(result => result ? vm.$navigateTo(Home.default) : vm.FnPrint({ _ref,id:vm.id }).then(() => vm.$navigateTo(Home.default)))
            }
        },
        created(){
            if(_.isEmpty(this.details[0])){
                let query = sql.format(fetch_a_transaction_detail,[this.id]);
                this.doStockDetail(query,'detail',this.id);
            }
        }
    }
</script>
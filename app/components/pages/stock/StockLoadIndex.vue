<template>
    <App title="Stock Load" action="Proceed" @proceed="proceed">
        <TextTitle>Stock Transfer IN</TextTitle>
        <AppForm :fields="fields()" @final="setFinals"></AppForm>
        <TextTitleSub class="m-t-15">Select a transfer to load</TextTitleSub>
        <AppList :source="stockList" :layout="listLayout" action="pick" @collection="setPicked"></AppList>
        <TextHighlight @tap.native="reload" class="w-full m-t-15 text-underline text-center">Sync from server</TextHighlight>
    </App>
</template>

<script>
    import { mapState,mapActions,mapGetters } from 'vuex';
    import {fetch_all_pending_transfer_outs} from "../../../assets/scripts/queries";
    const feMX = require('./../../../assets/scripts/mixins/formelement');

    export default {
        name: "StockLoadIndex",
        mixins: [feMX.common, feMX.store, feMX.fiscal],
        data(){ return {
            fieldLayout: { store:'Store',fycode:'Fiscal' },
            listLayout: { 'Doc No':'docno','Source Store':'store',Date:'date' },
            store:null, fycode:null, id:null,
            reloadSyncTables: ['transactions','transaction_details','store_product_transactions','stock_transfer'],
        }},
        computed: {
            ...mapState('Stock',{ stockList:'list' }),
            ...mapGetters({ settings:'Settings/setting',inDocno:'Stock/inDocno',user:'user',datetime:'datetime',ref:'_ref' }),
            fncode(){ return this.settings('STOCKTRANSFERINFNCODE') },
            docno(){ return this.inDocno(this.store,this.fycode,this.fncode) },
        },
        methods: {
            ...mapActions({ stock:'Stock/_stock',syncStock:'Sync/requeueSyncImmediate' }),
            fields(){
                let fields = this.appFormFields();
                fields.store.label = 'Select target store to load the stock';
                return fields;
            },
            setFinals(data){ _.forEach(data,(value,name) => this[name] = value) },
            setPicked(data){ if(data && data[0] && data[0].id) this.id = data[0].id; },
            reload(){
                _.forEach(this.reloadSyncTables,(table) => this.syncStock({ table }));
            },
            nProps(){
                return _.zipObject(['store','fycode','fncode','id','docno','user','date','payment_type','_ref'],[
                    this.store,this.fycode,this.fncode,this.id,this.docno,this.user,this.datetime(),'Credit',this.ref()
                ])
            },
            proceed(){
                if(!this.id) return alert('Select any available transfer to proceed');
                this.$navigateTo(require('./StockLoadItems').default,{ props:this.nProps(),backstackVisible:false })
            }
        },
        created() {
            this.stock({ query:sql.format(fetch_all_pending_transfer_outs) })
        }
    }
</script>
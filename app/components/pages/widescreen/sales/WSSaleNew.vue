<template>
    <App title="WIDE SCREEN NEW SALE" width="99%" scroll="false">
        <GridLayout rows="*" columns="440,*">
            <WSSaleNewLeftPortion row="0" col="0" @save="save"></WSSaleNewLeftPortion>
            <WSSaleNewRightPortion row="0" col="1" class="m-l-10"></WSSaleNewRightPortion>
        </GridLayout>
    </App>
</template>

<script>
    import { mapGetters,mapActions } from 'vuex';
    export default {
        name: "WSSaleNew",
        data(){ return {
            items: ['transactions','transaction_details','store_product_transactions'],
            transactions: [],
            transaction_details: [],
            store_product_transactions: [],
            transactions_keys: ['user','docno','date','customer','fycode','fncode','payment_type','_ref'],
            transaction_details_keys: ['transaction','spt','amount','tax','discount','total'],
            store_product_transactions_keys: ['store','product','direction','quantity','user','nature','date','type','_ref'],
            key_maps: {
                user_0:'getUser',docno_0:'getSaleDocNo',fncode_0:'type',payment_type_0:'payment',_ref_0:'getReference',
                transaction_1:'getTransactionRef',spt_1:'_ref',amount_1:'getAmount',
                store_2:'getStoreId',product_2:'id',direction_2:'getSaleDirection',user_2:'getUser',
                nature_2:'getSaleNature',type_2:'getTransactionType',date_2:'getDateTime'
            },
            extra: {
                store: null
            }
        }},
        computed: {
            ...mapGetters({ appUser:'user',getReferenceId:'_ref',getDocNo:'Sales/docno',tNatures:'TRNS/NameId',tTypes:'TRPS/NameId',getDateTime:'datetime' })
        },
        created(){
            EB.$on('wssale-sale-detail',(data) => {
                this.extra.store = data.store;
                this.setDataDetails(0,[data])
            })
        },
        methods: {
            ...mapActions({ enterSale:'Sales/sale' }),
            setDataDetails(item,dataArray){
                let keys = this[this.items[item]+'_keys'];
                _.forEach(dataArray,(data) => {
                    this[this.items[item]].push(this.getRecordDetails(keys,item,data))
                })
            },
            getRecordDetails(keys,item,data){
                let rData = Object.assign({},_.zipObject(keys,[]));
                _.forEach(keys,key => {
                    let mKey = key+'_'+item;
                    if(this.key_maps[mKey] && this[this.key_maps[mKey]]) rData[key] = this[this.key_maps[mKey]](data);
                    else if(_.has(data,this.key_maps[mKey])) rData[key] = data[this.key_maps[mKey]];
                    else if(_.has(data,key)) rData[key] = data[key];
                    else rData[key] = null;
                });
                return rData;
            },
            getUser(data){ return this.appUser },
            getSaleDocNo(data){ return this.getDocNo(data.store,data.fycode,data.type) },
            getReference(data){ return this.getReferenceId(1) },
            getTransactionRef(data){ return this.transactions[0]._ref },
            getAmount(data){ return (_.toNumber(data.rate)+_.toNumber(data.quantity)) },
            getStoreId(data){ return this.extra.store },
            getSaleDirection(data){ return 'Out' },
            getSaleNature(data){ return this.tNatures.Fresh },
            getTransactionType(data){ return this.tTypes.Sale },
            save(items){
                this.setDataDetails(2,items); this.setDataDetails(1,items);
                let reserve = { store:this.extra.store, fncode:this.transactions[0].fncode };
                this.enterSale({ transaction:this.transactions[0],details:this.transaction_details,spt:this.store_product_transactions,reserve }).then((_ref) => {
                    this.$navigateTo(require('./../../sales/SaleDetail').default,{ props: { id:_ref }});
                });
            }
        }
    }
</script>
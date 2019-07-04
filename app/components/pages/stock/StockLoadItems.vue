<template>
    <App title="Stock Load - Items" action="Save" @save="save">
        <AppList :source="items" :layout="listLayout" action="select" @collection="collection = $event"></AppList>
    </App>
</template>

<script>
    import { mapActions,mapState,mapGetters } from 'vuex';
    import {get_product_details_of_transaction} from "../../../assets/scripts/queries";
    export default {
        name: "StockLoadItems",
        props: ['store','fycode','fncode','id','docno','user','date','payment_type','_ref'],
        data(){ return {
            listLayout: { Product:'product',Quantity:'quantity' },
            listCast: { quantity:'quantity' },
            collection: [],
        }},
        computed: {
            ...mapState('Stock',['detail']),...mapGetters({ NEnum:'TRNS/NameId', TEnum:'TRPS/NameId' }),
            items(){ return this.detail[this.id] }
        },
        methods: {
            ...mapActions({ stockTranProds:'Stock/_stockIfNot',stockTransfer:'Stock/transferIn' }),
            save(){
                let data = this.getPreparedData();
                this.stockTransfer(data).then(({ docno }) => {
                    alert({ title: "Success!!", message: "Material Transfer In has done.\nDocument No: "+docno, okButtonText: "Go Home" })
                        .then(() => { this.$navigateTo(require('./../../Home').default); });
                })
            },
            getPreparedData(){
                let trn = _(['user','docno','date','fycode','fncode','payment_type','_ref']).mapKeys((item) => item).mapValues((item) => this[item]).value();
                let spt = [],sptDefault = { store:this.store, direction:'In',user:this.user,nature:this.NEnum['Fresh'],date:this.date,type:this.TEnum['Load'] };
                let trd = [];
                let refParts = this._ref.split('T'), refInt = parseInt(refParts[1]);
                _.forEach(this.collection,(item,idx) => {
                    let sptObj = _.assign({},sptDefault,{ product:item.pid,quantity:item.quantity,_ref:[refParts[0],refInt+idx].join('T') });
                    spt.push(sptObj);
                    let trdObj = { transaction:trn._ref,spt:sptObj._ref,amount:item.amount,tax:item.tax,discount:item.discount,total:item.total };
                    trd.push(trdObj);
                });
                return _.zipObject(['id','transactions','transaction_details','store_product_transactions'],[this.id,trn,trd,spt]);
            }
            //user,docno,date,fycode,fncode,payment_type,_ref
            // store,product,derrection,quantity,user,nature,date,type,_ref
            // trnsaction,spt,amount,tax,discount,total
        },
        created() {
            this.stockTranProds({ query:sql.format(get_product_details_of_transaction,this.id),path:this.id })
        }
    }
</script>
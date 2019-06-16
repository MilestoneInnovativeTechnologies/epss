<!--suppress ALL -->
<template>
    <App title="User Name">
        <UserStores width="90%"></UserStores>
        <UserAreas width="90%"></UserAreas>
        <Button @tap="ftb" text="Fet tables" />
        <ListPicker :items="tbls" v-model="stbl" />
        <Button @tap="ftbd" text="Fet dets" />
        <template v-for="(items,caption,sidx) in menus">
            <TextTitleSub class="m-t-12 m-b-8 m-l-2">{{ caption }}</TextTitleSub>
            <GridMenuRow :menus="items"></GridMenuRow>
        </template>
        <Button @tap="$navigateTo(Nuxt)" text="NUXT" />
        <Button @tap="dbg" text="DB Log" />
        <Button @tap="cstr" text="Create a nd ad store" />
    </App>
</template>

<script>
    import { mapGetters,mapState,mapActions } from 'vuex'
    import Nuxt from './Nuxt';
    import {table_information_db_table_name} from "../assets/scripts/vuex/constants";
    export default {
        name: "Home",
        computed: {
            ...mapGetters('Menu', ['menus']),
        },
        data(){ return {
            Nuxt:Nuxt,
            tbls:[table_information_db_table_name,'area_users','areas'  ,'fiscalyearmaster','functiondetails','pricelist_header','pricelist','product_transaction_natures','product_transaction_types','productgroups','products','sales_order','sales_order_items','settings','stores','store_product_transactions','transactions','transaction_details','stock_transfer','user_settings','user_store_area','users'],
            stbl:0,
            recs:[],
            dbl:[],
        }},
        methods: {
            ...mapActions('Stores',['_insert']),
            ftb(){
                let vm = this;
                DB.get('sqlite_master',null,function (vm) { _.forEach(this.result,(ob)=>{
                    vm.tbls.push(ob.tbl_name);
                }) },vm)
            },
            ftbd(){
                let vm = this;
                DB.get(this.tbls[this.stbl],null,function(vm){
                    vm.recs = this.result;
                    console.log('has ' + this.result.length + ' records');
                    console.log(_.head(this.result));
                },vm)
            },
            dbg(){
                this.dbl = DB.log();
            },
            cstr(){
                // let nm = _.random(456,999,false)
                // this._insert({ table:'stores',data:{ name:nm } });
                this._insert({ table:'stores',data:{ name:'joiilo' } });
                this._insert({ table:'user_store_area',data:{ store:5,user:300109,area:2 } })
                // DB.get('stores',{ name:nm },function(ins){
                //     let mid = _.get(_.head(this.result),'id');
                //     ins({ table:'user_store_area',data:{ store:mid,user:300109,area:2 } })
                // },this._insert)
            }
        },
        created() {
            console.log('Home created',this.key);
        }
    }
</script>
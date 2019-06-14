<!--suppress ALL -->
<template>
    <App title="User Name">
        <InfoWithIcon width="90%" heading="Stores" icon="store_mall_directory" :contents="['Store 1 Name','Store 2 Name']"></InfoWithIcon>
        <InfoWithIcon width="90%" heading="Areas" icon="map" :contents="['Area 1 Name','Area 2 Name']"></InfoWithIcon>
        <Button @tap="ftb" text="Fet tables" />
        <ListPicker :items="tbls" v-model="stbl" />
        <Button @tap="ftbd" text="Fet dets" />
        <template v-for="(items,caption,sidx) in menus">
            <TextTitleSub class="m-t-12 m-b-8 m-l-2">{{ caption }}</TextTitleSub>
            <GridMenuRow :menus="items"></GridMenuRow>
        </template>
    </App>
</template>

<script>
    import { mapGetters,mapState } from 'vuex'
    export default {
        name: "Home",
        computed: {
            ...mapGetters('Menu', ['menus']),
        },
        data(){ return {
            tbls:['area_users','areas','fiscalyearmaster','functiondetails','pricelist_header','pricelist','product_transaction_natures','product_transaction_types','productgroups','products','sales_order','sales_order_items','settings','stores','store_product_transactions','transactions','transaction_details','stock_transfer','user_settings','user_store_area','users'],
            stbl:0,
            recs:[]
        }},
        methods: {
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
            }
        },
        created() {
            console.log('Home created');
            this.tbls.push('transactions');
        }
    }
</script>
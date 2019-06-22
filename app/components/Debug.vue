<!--suppress ALL -->
<template>
    <App title="DEBUG">
        <AppList v-if="tblInfoSource.length" :source="tblInfoSource" :layout="tblInfolayout" title="Table Informations"></AppList>
        <Button v-else text="Fetch Table Informations" @tap="fTI" />
        <AppList v-if="qLogSource.length" :source="qLogSource" :layout="qLogLayout" title="Query Log"></AppList>
        <Button v-else text="Query Log" @tap="fQL" />
        <ListPicker :items="tables" v-model="selectedTableIndex"></ListPicker>
        <Button text="Get Table Data" @tap="gTD" />
        <AppList :source="selectedTableData" :title="tables[selectedTableIndex]"></AppList>
    </App>
</template>

<script>
    import {mapGetters, mapMutations, mapState, mapActions} from 'vuex'
    import {table_information_db_table_name} from "../assets/scripts/constants";

    export default {
        name: "Debug",
        data() {
            return {
                tblInfoSource:[],
                tblInfoLays: ['table','type','up','down','sync','next','create','update'],
                qLogSource:[],  qLogLayout:{ Query:'qry' },
                tables:['setup','area_users','areas','fiscalyearmaster','functiondetails','pricelist_header','pricelist','product_transaction_natures','product_transaction_types','productgroups','products','sales_order','sales_order_items','settings','stores','store_product_transactions','transactions','transaction_details','stock_transfer','user_settings','user_store_area','users'],
                selectedTableIndex:0,
                selectedTableData:[],
            }
        },
        computed: {
            ...mapState('Sync',['queue','queue_index','processing','url','time','user','client']),
            tblInfolayout(){ return _.mapKeys(this.tblInfoLays,(l) => _.capitalize(l) ) }
        },
        methods: {
            fQL(){ let qLog = DB.log(); this.qLogSource = _.map(qLog,(qry) => { return { qry } }) },
            fTI(){ DB.get(table_information_db_table_name,null,function (vm) { vm.tblInfoSource = this.result; },this) },
            gTD(){ DB.get(this.tables[this.selectedTableIndex],null,function(vm){ vm.selectedTableData.splice(0); Array.prototype.push.apply(vm.selectedTableData,this.result) },this) },
        },
    }
</script>
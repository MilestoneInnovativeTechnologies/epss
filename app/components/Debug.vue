<!--suppress ALL -->
<template>
    <App title="DEBUG">
        <AppList v-if="qLogSource.length" :source="qLogSource" :layout="qLogLayout" title="Query Log"></AppList>
        <Button v-else text="Query Log" @tap="fQL" />
        <AppForm :fields="tablePicker" @picker="selectedTableIndex = $event"></AppForm>
        <Button text="Get Table Data" @tap="gTD" />
        <AppList :source="selectedTableInfoData" :layout="tblInfolayout" :title="tables[selectedTableIndex]"></AppList>
        <Button text="Add Predefined Reserves" @tap="aPR" />
    </App>
</template>

<script>
    import {mapGetters, mapMutations, mapState, mapActions} from 'vuex'
    import {table_information_db_table_name} from "../assets/scripts/constants";
    const feMX = require('./../assets/scripts/mixins/formelement')

    export default {
        name: "Debug",
        mixins: [feMX.common,feMX.picker],
        data() {
            return {
                tblInfoSource:[],
                tblInfoLays: ['table','records'],
                qLogSource:[],  qLogLayout:{ Query:'qry' },
                tables:['setup','area_users','areas','fiscalyearmaster','functiondetails','pricelist_header','pricelist','product_transaction_natures','product_transaction_types','productgroups','products','sales_order','sales_order_items','settings','stores','store_product_transactions','transactions','transaction_details','stock_transfer','user_settings','user_store_area','users','receipts','fn_reserves'],
                selectedTableIndex:0,
                selectedTableInfoData:[],
            }
        },
        computed: {
            ...mapState('Sync',['queue','queue_index','processing','url','time','user','client']),
            tblInfolayout(){ return _.mapKeys(this.tblInfoLays,(l) => _.capitalize(l) ) },
            tablePicker(){ return { picker: {...(this.feFieldPicker),name:'picker',values:this.tables }} }
        },
        methods: {
            fQL(){ let qLog = DB.log(); this.qLogSource = _.map(qLog,(qry) => { return { qry } }) },
            gTD(){ DB.get(this.tables[this.selectedTableIndex],null,function(vm){ vm.selectedTableInfoData.push({ table:this.tbl, records:this.result.length }) },this) },
            aPR(){ DB.delete('fn_reserves',null,function(insData){
                DB.insert('fn_reserves',insData);
            },insData); }
        },
    }
    const insData = [{"fncode":"SL1","user":"","store":1,"start_num":100,"end_num":199,"quantity":100.0000000000,"current":0,"progress":"Awaiting","status":"Active",},{"fncode":"SL2","user":"","store":1,"start_num":100,"end_num":199,"quantity":100.0000000000,"current":0,"progress":"Awaiting","status":"Active",},{"fncode":"SR1","user":"","store":1,"start_num":100,"end_num":199,"quantity":100.0000000000,"current":0,"progress":"Awaiting","status":"Active",},{"fncode":"SO1","user":"","store":1,"start_num":100,"end_num":199,"quantity":100.0000000000,"current":0,"progress":"Awaiting","status":"Active",},{"fncode":"SL1","user":"","store":2,"start_num":200,"end_num":299,"quantity":100.0000000000,"current":0,"progress":"Awaiting","status":"Active",},{"fncode":"SL2","user":"","store":2,"start_num":200,"end_num":299,"quantity":100.0000000000,"current":0,"progress":"Awaiting","status":"Active",},{"fncode":"SR1","user":"","store":2,"start_num":200,"end_num":299,"quantity":100.0000000000,"current":0,"progress":"Awaiting","status":"Active",},{"fncode":"SO1","user":"","store":2,"start_num":200,"end_num":299,"quantity":100.0000000000,"current":0,"progress":"Awaiting","status":"Active",},{"fncode":"SL1","user":"","store":3,"start_num":300,"end_num":399,"quantity":100.0000000000,"current":0,"progress":"Awaiting","status":"Active",},{"fncode":"SL2","user":"","store":3,"start_num":300,"end_num":399,"quantity":100.0000000000,"current":0,"progress":"Awaiting","status":"Active",},{"fncode":"SR1","user":"","store":3,"start_num":300,"end_num":399,"quantity":100.0000000000,"current":0,"progress":"Awaiting","status":"Active",},{"fncode":"SO1","user":"","store":3,"start_num":300,"end_num":399,"quantity":100.0000000000,"current":0,"progress":"Awaiting","status":"Active"}];;
</script>
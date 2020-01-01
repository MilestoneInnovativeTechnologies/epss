<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <StackLayout>
            <AppForm v-if="tables.length > 0" action="Fetch" :fields="fields" :values="{ table:'epss_tblinfo' }" @submit="fetch" />
            <ScrollView>
                <AppList v-if="result.length > 0" :source="result" :layout="layout" :limit="result.length" :key="table" :maxHeadContents="maxHCN" />
                <TextBold v-else text="No Records" />
            </ScrollView>
        </StackLayout>
    </Page>
</template>

<script>
    const feMX = require('./../../assets/scripts/mixins/formelement');
    const fields = { table:'AppDBTables',condition:'Text' };

    export default {
        name: "DebugFour",
        mixins: [feMX.common,feMX.appdbtables,feMX.text],
        data(){ return {
            tables: [],
            result: [],
            table: '',
        } },
        computed: {
            fields(){ return this.appFormFields(fields) },
            layout(){ return _.mapKeys(_.mapValues(_.omit(_.head(this.result),['created_at','updated_at']),(value,name) => name),(name) => _.startCase(name)) },
            maxHCN(){ let fields = _.keys(this.layout).length; return (fields > 7) ? parseInt(fields/2.5) : 3 }
        },
        methods: {
            fetch({ table,condition }){
                this.result.splice(0); this.table = table;
                if(!condition || condition.trim() === '') condition = null;
                if(condition && ['[','{'].indexOf(condition.substr(0,1)) > -1) condition = JSON.parse(condition);
                let VM = this; DB.get(table,condition,function(vm){ vm.result = Array.isArray(this.result) ? this.result : [this.result] },VM);
            }
        },
        created(){
            DB.get('epss_tblinfo').then(records => this.tables = _.map(records,'table'))
        }
    };
</script>

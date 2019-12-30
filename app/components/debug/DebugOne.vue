<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <AppList v-if="records.length > 1" :source="records" :layout="{ Table:'table',Records:'records' }":limit="records.length" />
        <TextBold text="No Records" />
    </Page>
</template>

<script>
    export default {
        name: "DebugOne",
        data(){ return {
            tables: [],
            records: []
        } },
        methods: {
            recordQuery(table){ return `SELECT "${table}" AS "table",count(id) AS "records" FROM ${table}` },
            fetchQuery(tables){ return _.map(tables,table => this.recordQuery(table)).join(' UNION ') },
            fetchRecords(tables){
                if(!tables || !Array.isArray(tables) || tables.length < 1) return;
                DB.getAllQuery(this.fetchQuery(tables),function(vm){ vm['records'] = this.result; },[this])
            },
        },
        created(){
            DB.get('epss_tblinfo').then(records => this.tables = _.map(records,'table'))
        },
        watch: {
            tables: 'fetchRecords',
        }
    };
</script>

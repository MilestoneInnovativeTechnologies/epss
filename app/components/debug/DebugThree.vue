<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <ScrollView>
            <AppList v-if="records.length > 1" :source="source" :layout="layout" :limit="source.length" />
            <TextBold v-else text="No Records" />
        </ScrollView>
    </Page>
</template>

<script>
    const layout = { Table:'table',Records:'records',Time:'time',Status:'status',Message:'message' };

    export default {
        name: "DebugThree",
        data(){ return {
            records: [], layout
        } },
        computed: {
            source(){ return this.records.map(record => _.set(record,'time',moment.unix(record.updated_at).format('hh:m:ss A'))) },
        },
        created(){
            DB.get('epss_download').then(records => this.records = records)
        }
    };
</script>

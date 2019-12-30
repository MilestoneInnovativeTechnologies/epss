<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <ScrollView>
            <AppList v-if="records.length > 1" :source="source" :layout="layout" :limit="source.length" />
            <TextBold text="No Records" />
        </ScrollView>
    </Page>
</template>

<script>
    const progress = ['ADDED','CONSIDERED','RESPONDED'],
        layout = { Table:'table',Progress:'progress',Status:'status',Added:'added',Considered:'considered',Responded:'responded' };

    export default {
        name: "DebugTwo",
        data(){ return {
            records: [], progress, layout
        } },
        computed: {
            enums(){ return this.$store.state['Upload']['enums'] },
            source(){ return this.records.map(this.recordSource) },
        },
        methods: {
            recordSource({ url,status,progress,added,considered,responded }){
                return {
                    table: _.split(url,'/').pop(),
                    status: _(this.enums).omit(this.progress).invert().value()[status],
                    progress: _(this.enums).pick(this.progress).invert().value()[progress],
                    added: moment.unix(added).format('hh:m:ss A'),
                    considered: moment.unix(considered).format('hh:m:ss A'),
                    responded: moment.unix(responded).format('hh:m:ss A')
                }
            }
        },
        created(){
            DB.get('epss_sync').then(records => this.records = records)
        }
    };
</script>

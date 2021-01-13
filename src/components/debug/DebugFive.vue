<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <ScrollView row="1" col="0">
            <AppList v-if="log.length > 0" :source="log" :layout="{ Item:'text' }" :limit="100" />
            <TextBold v-else text="No Records" />
        </ScrollView>
    </Page>
</template>

<script>
    export default {
        name: "DebugFive",
        computed: {
            log(){ return this.$store.state['Log']['queue'].map(text => _.zipObject(['text'],[text])) }
        },
    };
</script>

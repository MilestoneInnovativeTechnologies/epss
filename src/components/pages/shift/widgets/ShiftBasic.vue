<template>
    <StackLayout>
        <TextTitleSub v-if="title" :text="title" />
        <AppInfoWide title="DOCNO">{{ detail.docno }}</AppInfoWide>
        <AppInfoWide title="Date">{{ detail.start_date }}</AppInfoWide>
        <AppInfoWide title="Opening">{{ opening }}</AppInfoWide>
    </StackLayout>
</template>

<script>
    export default {
        name: "ShiftBasic",
        props: ['shift','title'],
        computed: {
            detail(){ return _.first(this.$store.state.Shift.dbData[this.$store.state.Shift['dbTables'][0]].filter(({_ref}) => this.shift == _ref)) },
            opening(){ return __.amount(this.detail ? this.detail.opening : 0) }
        }
    }
</script>
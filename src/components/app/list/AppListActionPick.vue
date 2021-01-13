<template>
    <FontIcon size="22" :name="checks[iconIndex]" />
</template>

<script>
    export default {
        name: "AppListActionPick",
        props: ['status'],
        data(){ return {
            checks: ['radio_button_unchecked','radio_button_checked'],
        }},
        computed: {
            iconIndex(){ let status = this.status; return _.toSafeInteger(status); }
        }
    }
</script>

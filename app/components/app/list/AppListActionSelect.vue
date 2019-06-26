<template>
    <FontIcon size="22" :name="checks[iconIndex]"></FontIcon>
</template>

<script>
    export default {
        name: "AppListActionSelect",
        props: ['status'],
        data(){ return {
            checks: ['check_box_outline_blank','check_box'],
        }},
        computed: {
            iconIndex(){ let status = this.status; return _.toSafeInteger(status); }
        }
    }
</script>
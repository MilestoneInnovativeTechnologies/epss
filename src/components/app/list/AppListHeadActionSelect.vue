<template>
    <FontIcon :name="checks[iconIndex]" />
</template>

<script>
    export default {
        name: "AppListHeadActionSelect",
        props: ['status'],
        data(){ return {
            checks: ['check_box_outline_blank','check_box','indeterminate_check_box']
        }},
        computed: {
            iconIndex(){ let status = this.status; return _.toSafeInteger(status); }
        }
    }
</script>

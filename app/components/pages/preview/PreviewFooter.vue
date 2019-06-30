<template>
    <TextItalic>{{ footer_text }}</TextItalic>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "PreviewFooter",
        computed: {
            ...mapState('Organization',['footer_text'])
        }
    }
</script>
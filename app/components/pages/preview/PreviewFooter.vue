<template>
    <TextItalic width="100%" style="text-align: center; font-size: 12;">{{ footer_text }}</TextItalic>
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
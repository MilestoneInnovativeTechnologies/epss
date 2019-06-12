<template>
    <TextBold class="cp fs20" :text="mText" />
</template>

<script>
    export default {
        name: "TextHighlightBold",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>
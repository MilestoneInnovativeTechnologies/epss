<template>
    <TextRegular :text="mText" class="cp" />
</template>

<script>
    export default {
        name: "TextHighlight",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>
<template>
    <TextBold :text="mText" class="fs20 text-uppercase" />
</template>

<script>
    export default {
        name: "TextHeading",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>
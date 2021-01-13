<template>
    <TextBold :text="mText" class="fs16 text-uppercase" style="text-decoration: underline" />
</template>

<script>
    export default {
        name: "TextHeadingSub",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>
<template>
    <TextBold :text="mText" class="fs16 text-uppercase" v-bind="$attrs" />
</template>

<script>
    export default {
        name: "TextHeading",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>

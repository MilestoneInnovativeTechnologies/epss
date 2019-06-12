<template>
    <TextRegular :text="mText" class="c-grey-light" />
</template>

<script>
    export default {
        name: "TextHeadingInfoWithIcon",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>
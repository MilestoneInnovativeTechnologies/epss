<template>
    <TextBold :text="mText" class="fs12 text-uppercase c-grey-light" />
</template>

<script>
    export default {
        name: "TextHeadingRowSub",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>
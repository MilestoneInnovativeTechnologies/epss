<template>
    <TextBold class="c-black fs18 text-uppercase" :text="mText" />
</template>

<script>
    export default {
        name: "TextTitleSub",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>
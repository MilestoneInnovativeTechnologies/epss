<template>
    <TextBold class="c-black fs15 text-uppercase" :text="mText" />
</template>

<script>
    export default {
        name: "TextTitleSubSmall",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>
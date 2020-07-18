<template>
    <TextBold class="fs22 cp text-uppercase" :text="mText" />
</template>

<script>
    export default {
        name: "TextTitle",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>

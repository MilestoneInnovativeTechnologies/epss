<template>
    <TextBold class="fs22 cp text-uppercase">{{ mText }}</TextBold>
</template>

<script>
    export default {
        name: "TextTitle",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>
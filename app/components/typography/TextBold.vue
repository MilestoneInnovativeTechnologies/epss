<template>
    <Label class="fsb font-weight-bold c-black" :text="mText" />
</template>

<script>
    export default {
        name: "TextBold",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>

<style scoped>

</style>
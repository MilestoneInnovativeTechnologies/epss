<template>
    <Label class="fsr c-black" :text="mText" />
</template>

<script>
    export default {
        name: "TextRegular",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>

<style scoped>

</style>
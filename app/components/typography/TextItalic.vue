<template>
    <Label class="fsi" :text="mText" />
</template>

<script>
    export default {
        name: "TextItalic",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>

<style scoped>

</style>
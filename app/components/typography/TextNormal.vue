<template>
    <label class="fsr" :text="mText" />
</template>

<script>
    export default {
        name: "TextNormal",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>
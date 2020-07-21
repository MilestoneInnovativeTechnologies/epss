<template>
    <Label class="fsb font-weight-bold c-black" :text="mText" v-bind="$attrs" />
</template>

<script>
    export default {
        name: "TextBold",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>

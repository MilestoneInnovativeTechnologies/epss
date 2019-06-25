<template>
    <Button class="bcp fsb" :text="mText"></Button>
</template>

<script>
    export default {
        name: "AppButton",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>
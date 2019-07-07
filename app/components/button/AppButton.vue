<template>
    <Button class="bcp fsb" height="60" :text="mText"></Button>
</template>

<script>
    export default {
        name: "AppButton",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
    }
</script>
<template>
    <Button class="fsb" :class="btnCls" :height="height" :text="mText"></Button>
</template>

<script>
    export default {
        name: "AppButton",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
        props: {
            height: { default:60 },
            bcc: { default:'bcp' }
        },
        computed: {
            btnCls(){ return [this.bcc]; },
        }
    }
</script>
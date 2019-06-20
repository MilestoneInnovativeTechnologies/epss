<template>
    <TextBold :style="styles" :text="mText" width="100%" class="text-center m-0 p-0" />
</template>

<script>
    export default {
        name: "TextDisplay",
        mixins: [require('./../../assets/scripts/mixins/typography').default],
        props: {
            size: { default:40 }
        },
        computed: {
            styles(){ return { fontSize:this.size + '',lineHeight:1+'',margin:0+'',padding:0+'' } }
        }
    }
</script>
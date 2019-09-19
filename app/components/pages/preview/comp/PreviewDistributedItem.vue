<template>
    <StackLayout>
        <TextBold :class="alignClass" style="color: black; width: 100%; font-size: 16; text-transform: uppercase">{{ title }}</TextBold>
        <TextRegular :class="alignClass" style="color: black; width: 100%; font-size: 20; text-transform: uppercase" :text="mText"></TextRegular>
    </StackLayout>
</template>

<script>
    export default {
        name: "PreviewDistributedItem",
        props: ['title','right'],
        mixins: [require('./../../../../assets/scripts/mixins/typography').default],
        computed: {
            alignClass(){ return (this.right) ? 'text-right' : 'text-left' }
        },
        mounted(){
            let printCmd = []
                .concat(printer.TEXT(this.title.toString().toUpperCase()))
                .concat(printer.TEXT(': '))
                .concat(printer.BOLDON())
                .concat(printer.TEXT(this.mText.toString().toUpperCase()))
                .concat(printer.BOLDOFF())
            ;
            this.$emit('print',printCmd);
        }
    }
</script>

<style scoped>

</style>
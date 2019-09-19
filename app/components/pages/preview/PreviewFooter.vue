<template>
    <TextItalic width="100%" style="text-align: center; font-size: 12;">{{ footer_text }}</TextItalic>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "PreviewFooter",
        computed: {
            ...mapState('App',['footer_text'])
        },
        mounted(){
            let vm = this;
            this.$nextTick(() => {
                let printCmd = [].concat(printer.TEXT(vm.footer_text));
                vm.$emit('print',printCmd);
            })
        }
    }
</script>
<template>
    <GridLayout columns="*,*">
        <TextRegular col="0" style="color: #000000; text-transform: uppercase; font-size: 16; vertical-align: center">{{ title }}</TextRegular>
        <TextRegular col="1" style="color: #000000; text-transform: uppercase; font-size: 20; text-align: right" :style="extraStyle">{{ mText }}</TextRegular>
    </GridLayout>
</template>

<script>
    export default {
        name: "PreviewWideItem",
        props: ['title','big','small','bold','display'],
        mixins: [require('./../../../../assets/scripts/mixins/typography').default],
        computed: {
            extraStyle(){
                let extSty = {};
                if(this.bold !== undefined) extSty['font-weight'] = 'bold';
                if(this.small !== undefined) extSty['font-size'] = '16 !important';
                if(this.big !== undefined) extSty['font-size'] = '25 !important';
                if(this.display !== undefined) { extSty['font-size'] = '35 !important'; extSty['font-weight'] = 'bold'; }
                return extSty;
            }
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
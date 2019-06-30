<template>
    <GridLayout columns="*,*">
        <TextTitleSub col="0" style="color: #000000">{{ title }}</TextTitleSub>
        <TextTitleSub col="1" class="text-right c-black" :text="mText"></TextTitleSub>
    </GridLayout>
</template>

<script>
    export default {
        name: "PreviewWideItem",
        props: ['title'],
        mixins: [require('./../../../../assets/scripts/mixins/typography').default],
    }
</script>
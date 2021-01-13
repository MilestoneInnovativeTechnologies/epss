<template>
    <GridLayout rows="auto" columns="2*,*">
        <TextBold row="0" col="0" class="text-left" :text="mText" />
        <TextHeadingRowSub row="0" col="1" class="text-right" :text="title" />
    </GridLayout>
</template>

<script>
    export default {
        name: "AppInfoWide",
        props: ['title'],
        mixins: [require('./../../../assets/scripts/mixins/typography').default],
    }
</script>

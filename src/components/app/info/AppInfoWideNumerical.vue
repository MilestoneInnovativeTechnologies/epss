<template>
    <GridLayout rows="auto" columns="2*,*">
        <TextRegular row="0" col="0" class="text-right">{{ title }}</TextRegular>
        <TextBold row="0" col="1" class="text-right" :text="mText"></TextBold>
    </GridLayout>
</template>

<script>
    export default {
        name: "AppInfoWideNumerical",
        props: ['title'],
        mixins: [require('./../../../assets/scripts/mixins/typography').default],
    }
</script>
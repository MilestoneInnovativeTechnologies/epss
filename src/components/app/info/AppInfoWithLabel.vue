<template>
    <StackLayout>
        <TextHeadingRowSub>{{ title }}</TextHeadingRowSub>
        <TextBold :text="mText"></TextBold>
    </StackLayout>
</template>

<script>
    export default {
        name: "AppInfoWithLabel",
        props: ['title'],
        mixins: [require('./../../../assets/scripts/mixins/typography').default],
    }
</script>
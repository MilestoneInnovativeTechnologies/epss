<template>
    <FlexBoxLayout flexDirection="column">
        <TextDisplay class="text-center" :text="mText" />
        <TextTitleSubSmall class="text-center cp" :text="title" />
    </FlexBoxLayout>
</template>

<script>
    export default {
        name: "AppInfoHighlight",
        props: ['title'],
        mixins: [require('./../../../assets/scripts/mixins/typography').default],
    }
</script>

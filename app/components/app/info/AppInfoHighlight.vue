<template>
    <FlexBoxLayout flexDirection="column">
        <TextDisplay class="text-center" :text="mText"></TextDisplay>
        <TextTitleSubSmall class="text-center cp">{{ title }}</TextTitleSubSmall>
    </FlexBoxLayout>
</template>

<script>
    export default {
        name: "AppInfoHighlight",
        props: ['title'],
        mixins: [require('./../../../assets/scripts/mixins/typography').default],
    }
</script>
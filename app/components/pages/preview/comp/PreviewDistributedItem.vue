<template>
    <StackLayout>
        <TextHeadingRowSub :class="alignClass" style="color: black; width: 100%;">{{ title }}</TextHeadingRowSub>
        <TextHeading :class="alignClass" style="color: black; width: 100%" :text="mText"></TextHeading>
    </StackLayout>
</template>

<script>
    export default {
        name: "PreviewDistributedItem",
        props: ['title','right'],
        mixins: [require('./../../../../assets/scripts/mixins/typography').default],
        computed: {
            alignClass(){ return (this.right) ? 'text-right' : 'text-left' }
        }
    }
</script>

<style scoped>

</style>
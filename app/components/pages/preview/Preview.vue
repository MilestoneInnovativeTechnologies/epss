<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="false">
        <GridLayout rows="*,60">
            <ScrollView row="0">
                <StackLayout width="95%">
                    <PreviewHead class="m-b-15"></PreviewHead>
                    <TextTitleSub v-if="title" style="width: 100%; text-align: center" class="m-b-15">{{ title }}</TextTitleSub>
                    <slot></slot>
                    <PreviewFooter></PreviewFooter>
                </StackLayout>
            </ScrollView>
            <StackLayout row="1" orientation="horizontal"></StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    export default {
        name: "Preview",
        props: ['title']
    }
</script>

<style scoped>

</style>
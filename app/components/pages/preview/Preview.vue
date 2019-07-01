<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="false">
        <GridLayout rows="*,60">
            <ScrollView row="0">
                <StackLayout width="95%">
                    <PreviewHead class="m-b-15"></PreviewHead>
                    <TextHeading v-if="title" style="width: 100%; text-align: center" class="m-b-15">{{ title }}</TextHeading>
                    <slot></slot>
                    <template v-if="template">
                        <component v-for="(compAry,no) in template" :is="properComponent(compAry[0])" v-bind="compAry[1]" :key="['pt',unique,no].join('-')" class="m-b-15"></component>
                    </template>
                    <PreviewFooter class="m-t-20"></PreviewFooter>
                </StackLayout>
            </ScrollView>
            <StackLayout row="1" orientation="horizontal"></StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    export default {
        name: "Preview",
        props: ['title','template'],
        computed: {
            unique(){ return new Date().getTime() }
        },
        methods: {
            properComponent(comp){ return 'Preview' + _.upperFirst(comp); }
        },
    }
</script>
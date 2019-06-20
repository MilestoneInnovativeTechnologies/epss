<!--suppress ALL -->
<template>
    <Page actionBarHidden="false" backgroundSpanUnderStatusBar="true">
        <CustomActionBar :title="title"></CustomActionBar>
        <ScrollView>
            <StackLayout width="95%" class="m-t-10">
                <slot></slot>
            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>
    export default {
        name: 'App',
        props: ['title'],
    }
</script>
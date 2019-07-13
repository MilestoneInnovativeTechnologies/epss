<!--suppress ALL -->
<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="true" @navigatedTo="navigationBusy = false" @navigatingFrom="navigationBusy = true" @navigatingTo="navigationBusy = true">
        <Drawer>
            <CustomActionBar :title="title" :back="back" :drawer="drawer"></CustomActionBar>
            <AbsoluteLayout class="w-full">
                <MainContent top="0" left="0" class="w-full h-full" v-bind="mainContentBind" v-on="$listeners"><slot></slot></MainContent>
                <NavigationSpinner top="0" left="0" class="w-full h-full" v-if="navigationBusy"></NavigationSpinner>
            </AbsoluteLayout>
        </Drawer>
    </Page>
</template>

<script>
    export default {
        name: 'App',
        props: {
            title: String,
            back: { type: [String,Boolean], default: true },
            drawer: { type: [String,Boolean], default: true },
            action: String,
            scroll: { type: [Boolean,String], default: true },
            width: { type: [String,Number], default: '95%' },
            center: { type: [String,Boolean], default: false },
            actionProps: { type:Object },
        },
        data(){ return {
            mainContentProps: ['action','scroll','width','center','actionProps'],
            navigationBusy: false,
        }},
        computed: {
            mainContentBind(){  return _(this.mainContentProps).mapKeys(i => i).mapValues(i => this[i]).value() },
        }
    }
</script>
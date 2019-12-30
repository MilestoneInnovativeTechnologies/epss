<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <StackLayout>
            <AppButton @tap.native="$navigateTo(require('./../Home').default)">Back to Home</AppButton>
            <GridLayout :rows="rows" columns="*" width="90%">
                <GridLayout :row="idx" col="0" rows="auto" columns="auto,3*,*" v-for="(text,item,idx) in items" :key="'dc-'+idx">
                    <TextNormal col="0" :text="idx+1+'. '" verticalAlignment="middle" class="p-r-16" />
                    <TextNormal col="1" :text="text" textWrap="true" verticalAlignment="middle" />
                    <AppButton col="2" @tap.native="goTo(item)" text="GO" height="50" />
                </GridLayout>
            </GridLayout>
        </StackLayout>
    </Page>
</template>

<script>
    export default {
        name: "DebugIndex",
        data() { return {
            items: {
                One: 'DB Records Count',
                Two: 'Upload Logs',
                Three: 'Download Logs',
            }
        } },
        computed: {
            rows(){ return Array(_.keys(this.items).length).fill('auto').join(',') },
        },
        methods: {
            goTo(item){ return this.$navigateTo(require('./Debug' + item + '.vue').default) }
        }
    }
</script>

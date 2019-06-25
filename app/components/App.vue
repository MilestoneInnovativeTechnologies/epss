<!--suppress ALL -->
<template>
    <Page actionBarHidden="false" backgroundSpanUnderStatusBar="true">
        <CustomActionBar :title="title"></CustomActionBar>
        <GridLayout :rows="rows">
            <ScrollView row="0"><StackLayout class="p-t-10" width="95%"><slot></slot></StackLayout></ScrollView>
            <StackLayout row="1" orientation="horizontal"><AppButton class="c-white" :width="width" v-for="(btn,idx) in actions" @tap.native="$emit(eventName(btn))" :key="['app',unique,'btn',idx].join('-')">{{ btn }}</AppButton></StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    export default {
        name: 'App',
        props: ['title','action'],
        data(){ return {
            fixHeight: 60
        }},
        computed: {
            unique(){ return new Date().getTime() },
            rows(){ let rows = ['*']; rows.push(_.toSafeInteger(!!this.action)*this.fixHeight); return rows.join(','); },
            actions(){ return _.concat(this.action); },
            width(){ return _.toSafeInteger(100/this.actions.length)+'%' }
        },
        methods: {
            eventName(name){ return _.kebabCase(name) }
        }
    }
</script>
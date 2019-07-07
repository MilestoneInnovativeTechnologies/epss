<!--suppress ALL -->
<template>
    <Page actionBarHidden="false" backgroundSpanUnderStatusBar="true">
        <CustomActionBar :title="title"></CustomActionBar>
        <GridLayout :rows="rows">
            <ScrollView v-if="scroll !== 'false' && scroll !== false" row="0"><StackLayout :verticalAlignment="vAlign" class="p-t-10" :width="width"><slot></slot></StackLayout></ScrollView>
            <StackLayout v-else :verticalAlignment="vAlign" row="0" class="p-t-10" :width="width"><slot></slot></StackLayout>
            <StackLayout row="1" orientation="horizontal"><AppButton class="c-white btn-active" v-bind="bindVars(btn)" :width="actWidth" v-for="(btn,idx) in actions" @tap.native="$emit(eventName(btn))" :key="['app',unique,'btn',idx].join('-')">{{ btn }}</AppButton></StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    export default {
        name: 'App',
        props: {
            title: String,
            action: String,
            scroll: { type: [Boolean,String], default: true },
            width: { type: [String,Number], default: '95%' },
            center: { type: [String,Boolean], default: false },
            actionProps: { type:Object }
        },
        data(){ return {
            fixHeight: 60
        }},
        computed: {
            unique(){ return new Date().getTime() },
            rows(){ let rows = ['*'], action = !!this.action; rows.push(_.toSafeInteger(action)*this.fixHeight); return rows.join(','); },
            vAlign(){ return (this.center === true || this.center === 'true') ? 'center' : 'top' },
            actions(){ let actions = this.action; return (actions) ? _.concat(actions) : []; },
            actWidth(){ return _.toSafeInteger(100/this.actions.length)+'%' }
        },
        methods: {
            eventName(name){ return _.kebabCase(name) },
            bindVars(act){
                let name = this.eventName(act); return (_.isEmpty(this.actionProps))
                    ? {}
                    : ( _.has(this.actionProps,name) ? this.actionProps[name] : this.actionProps )
            }
        }
    }
</script>
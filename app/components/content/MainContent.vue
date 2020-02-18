<template>
    <GridLayout :rows="rows">
        <ScrollView v-if="scroll !== 'false' && scroll !== false" row="0"><StackLayout :verticalAlignment="vAlign" class="p-t-10" :width="width"><slot></slot></StackLayout></ScrollView>
        <StackLayout v-else :verticalAlignment="vAlign" row="0" class="p-t-10" :width="width"><slot></slot></StackLayout>
        <StackLayout row="1" orientation="horizontal" width="100%"><AppButton class="c-white btn-active" v-bind="bindVars(btn)" :width="actWidth(btn)" v-for="(btn,idx) in actions" @tap.native="$emit(eventName(btn))" :key="['app',unique,'btn',idx].join('-')">{{ btn }}</AppButton></StackLayout>
    </GridLayout>
</template>

<script>
    export default {
        name: "MainContent",
        props: ['action','scroll','width','center','actionProps'],
        data(){ return {
            fixHeight: 60,
        }},
        computed: {
            unique(){ return new Date().getTime() },
            rows(){ let rows = ['*'], action = !!this.action; rows.push(_.toSafeInteger(action)*this.fixHeight); return rows.join(','); },
            vAlign(){ return (this.center === true || this.center === 'true') ? 'center' : 'top' },
            actions(){ let actions = this.action; return (actions) ? _.concat(actions) : []; },
        },
        methods: {
            eventName(name){ return _.kebabCase(name) },
            actionProp(name){ return (_.isEmpty(this.actionProps)) ? {} : ( _.has(this.actionProps,name) ? this.actionProps[name] : this.actionProps ) },
            bindVars(act){ let name = this.eventName(act); return this.actionProp(name); },
            actWidth(act){ let name = this.eventName(act); return (this.actionProp(name).width || _.toSafeInteger(100/this.actions.length))+'%' }
        }
    }
</script>
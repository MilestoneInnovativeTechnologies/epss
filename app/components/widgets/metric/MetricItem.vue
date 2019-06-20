<template>
    <GridLayout :rows="rows" columns="*" class="m-x-4 p-15 metric-item">
        <FontIcon row="0" col="0" v-if="icon" :style="iconStyle" class="cp text-center m-b-0" verticalAlignment="bottom">{{ icon }}</FontIcon>
        <TextDisplay row="1" col="0" verticalAlignment="middle" class="m-0 p-0" :class="displayClass" :size="displaySize">{{ text }}</TextDisplay>
        <TextTitleSub row="2" col="0" v-if="title" class="text-center cp m-t-0" verticalAlignment="top">{{ title }}</TextTitleSub>
    </GridLayout>
</template>

<script>
    export default {
        name: "MetricItem",
        props: {
            icon:{ default:null },
            text:{ default:'display' },
            title:{ default:null },
            coloured: { default:false },
            size: { default:40 }
        },
        computed: {
            iconStyle(){ return { fontSize:(this.size-5)+'' } },
            displaySize(){ return this.size+5 },
            displayClass(){ return this.coloured === false ? [] : ['cp'] },
            rows(){ return [this.icon ? '*' : 0,'auto',this.title ? '*' : 0].join(',') }
        }
    }
</script>

<style scoped>
    .metric-item {
        border-radius: 5;
        border-width: 1;
        border-color: #F1F1F1;
    }
</style>
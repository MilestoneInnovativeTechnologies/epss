<template>
    <GridLayout rows="*" :columns="columns">
        <MetricItem row="0" v-for="(item,colNo) in items" :col="colNo" v-bind="item" :key="['metric',unique,'col',colNo].join('-')"></MetricItem>
    </GridLayout>
</template>

<script>
    export default {
        name: "AppMetric",
        props: {
            items: { type:Array,default:()=>[{ icon:'receipt',text:'display',title:'title'}] }
        },
        computed: {
            unique(){ return new Date().getTime() },
            itemsCount(){ return this.items.length },
            columns(){ return _.fill(Array(this.itemsCount),'*').join(',') }
        }
    }
</script>
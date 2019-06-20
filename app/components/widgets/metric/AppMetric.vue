<template>
    <GridLayout rows="*" :columns="columns" >
        <MetricItem row="0" v-for="(item,colNo) in items" :col="colNo" v-bind="item"></MetricItem>
    </GridLayout>
</template>

<script>
    export default {
        name: "AppMetric",
        props: {
            items: { type:Array,default:()=>[{ icon:'receipt',text:'display',title:'title'}] }
        },
        computed: {
            itemsCount(){ return this.items.length },
            columns(){ return _.fill(Array(this.itemsCount),'*').join(',') }
        }
    }
</script>

<style scoped>

</style>
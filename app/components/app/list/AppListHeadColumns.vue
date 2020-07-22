<!--suppress ALL -->
<template>
    <GridLayout class="applist-thead-columns" :columns="columns">
        <TextBold v-for="(head,colNo) in headColumns" :col="colNo" class="applist-thead-column" :key="key(colNo)" :text="head" />
    </GridLayout>
</template>

<script>
    export default {
        name: "AppListHeadColumns",
        props: {
            headColumns: { type:Array,default:()=>['Name'] }
        },
        computed: {
            unique(){ return new Date().getTime() },
            key(){ return (colNo) => ['applist',this.unique,'head','column',colNo].join('-') },
            columns(){ return _.fill(Array(this.headColumns.length),'*').join(',') }
        }
    }
</script>

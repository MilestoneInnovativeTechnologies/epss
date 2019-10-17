<template>
    <GridLayout rows="auto" :columns="columns" class="m-b-2">
        <GridMenuSectionItem v-for="(item,idx) in items" :key="'gmi'+idx" :class="itmCls" row="0" :col="idx" :item="item" :height="height"></GridMenuSectionItem>
    </GridLayout>
</template>

<script>
    export default {
        name: "GridMenuSectionItems",
        props: ['items','height','space'],
        computed: {
            columns(){ return _.fill(_.range(0,this.items.length),'*').join(',') },
            itmCls(){ return ['m','x',this.space].join('-') }
        }
    }
</script>
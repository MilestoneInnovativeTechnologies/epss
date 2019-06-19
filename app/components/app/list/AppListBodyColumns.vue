<template>
    <GridLayout class="applist-tbody-columns" :rows="rows" :columns="columns">
        <TextRegular v-for="(path,colNo) in mainLayoutPaths" row="0" :col="colNo" class="applist-tbody-column" :class="linkClass(path)" @tap.native="navigate(path)" :textWrap="mainLayoutPaths.length === 1" :key="key(colNo)">{{ content(path) }}</TextRegular>
        <AppListBodyColumnSubRow v-if="hasSubRow" row="1" col="0" :colSpan="headColumnCount" :item="item" :layout="subLayout" :links="links"></AppListBodyColumnSubRow>
    </GridLayout>
</template>

<script>
    import { getContentComponentOptions } from './../../../assets/scripts/mixins/getcontent';
    import { AppListLinkNavigate } from './../../../assets/scripts/mixins/applistlink';

    export default {
        name: "AppListBodyColumns",
        props: {
            item: { type:Object,default:()=>{ return { name:'ePlus' } } },
            headColumnCount: { type:Number,default:1 },
            layout: { type:Object,default:()=> { return { Name:'name' } } },
        },
        mixins: [getContentComponentOptions,AppListLinkNavigate],
        computed:{
            unique(){ return new Date().getTime() },
            key(){ return (colNo) => ['applist',this.unique,'head','column',colNo].join('-') },
            hasSubRow(){ return _.keys(this.layout).length > this.headColumnCount },
            rows(){ return _.fill(Array(_.toSafeInteger(this.hasSubRow)+1),'auto').join(',') },
            columns(){ return _.fill(Array(this.headColumnCount),'*').join(',') },
            mainLayoutPaths(){ return _.take(_.values(this.layout),this.headColumnCount) },
            content(){ return (path) => this.getContent(_.get(this.item,path)); },
            subLayout(){ return _.pick(this.layout,_.slice(_.keys(this.layout),this.headColumnCount)) },
        },
    }
</script>
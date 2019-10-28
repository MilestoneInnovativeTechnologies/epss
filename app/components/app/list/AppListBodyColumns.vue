<template>
    <GridLayout class="applist-tbody-columns" :rows="rows" :columns="columns">
        <AppListBodyColumnContent v-for="(path,colNo) in mainLayoutPaths" row="0" :col="colNo" :idx="row" class="applist-tbody-column" :key="key(colNo)" :path="path" :item="item" :wrap="mainLayoutPaths.length === 1" :links="links" :update="updates[path]" :text="content(path)"></AppListBodyColumnContent>
        <AppListBodyColumnSubRow v-if="hasSubRow" row="1" col="0" :idx="row" :colSpan="headColumnCount" :item="item" :layout="subLayout" :cast="cast" :links="links" :updates="updates"></AppListBodyColumnSubRow>
    </GridLayout>
</template>

<script>
    import { getContentComponentOptions } from './../../../assets/scripts/mixins/getcontent';

    export default {
        name: "AppListBodyColumns",
        props: ['row','item','headColumnCount','layout','cast','links','updates'],
        mixins: [getContentComponentOptions],
        computed:{
            unique(){ return new Date().getTime() },
            key(){ return (colNo) => ['applist',this.unique,'head','column',colNo].join('-') },
            hasSubRow(){ return _.keys(this.layout).length > this.headColumnCount },
            rows(){ return _.fill(Array(_.toSafeInteger(this.hasSubRow)+1),'auto').join(',') },
            columns(){ return _.fill(Array(this.headColumnCount),'*').join(',') },
            mainLayoutPaths(){ return _.take(_.values(this.layout),this.headColumnCount) },
            content(){ return (path) => (!_.isEmpty(this.cast) && _.has(this.cast,path)) ? __[this.cast[path]](this.getContent(_.get(this.item,path))) : this.getContent(_.get(this.item,path)); },
            subLayout(){ return _.pick(this.layout,_.slice(_.keys(this.layout),this.headColumnCount)) },
        },
    }
</script>
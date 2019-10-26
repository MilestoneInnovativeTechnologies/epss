<template>
    <GridLayout class="applist-tbody-sub-row" :columns="columns">
        <StackLayout v-for="(path,head,no) in layout" :col="no" class="applist-tbody-sub-row-columns" :key="key(no)">
            <TextHeadingRowSub class="applist-tbody-sub-row-column applist-tbody-sub-row-column-head">{{ head }}</TextHeadingRowSub>
<!--            <TextRegular class="applist-tbody-sub-row-column applist-tbody-sub-row-column-detail" :class="_linkClass(path)" @tap.native="_linkNavigate(path)">{{ content(path) }}</TextRegular>-->
            <AppListBodyColumnContent :idx="idx" class="applist-tbody-sub-row-column applist-tbody-sub-row-column-detail" :path="path" :item="item" :wrap="false" :links="links" :updates="updates">{{ content(path) }}</AppListBodyColumnContent>
        </StackLayout>
    </GridLayout>
</template>

<script>
    import { getContentComponentOptions } from "../../../assets/scripts/mixins/getcontent";
    import { AppListLinkNavigate } from "../../../assets/scripts/mixins/applistlink";

    export default {
        name: "AppListBodyColumnSubRow",
        props: ['item','layout','idx','cast','links','updates'],
        mixins: [getContentComponentOptions,AppListLinkNavigate],
        computed: {
            unique(){ return new Date().getTime() },
            key(){ return (colNo) => ['applist',this.unique,'head','column',colNo].join('-') },
            columns(){ return _.fill(Array(_.toArray(this.layout).length),'*').join(',') },
            content(){ return (path) => (!_.isEmpty(this.cast) && _.has(this.cast,path)) ? __[this.cast[path]](this.getContent(_.get(this.item,path))) : this.getContent(_.get(this.item,path)); },
        }
    }
</script>
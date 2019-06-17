<template>
    <GridLayout class="applist-tbody-sub-row" :columns="columns">
        <StackLayout v-for="(path,head,no) in layout" :col="no" class="applist-tbody-sub-row-columns" :key="key(no)">
            <TextHeadingRowSub class="applist-tbody-sub-row-column applist-tbody-sub-row-column-head">{{ head }}</TextHeadingRowSub>
            <TextRegular class="applist-tbody-sub-row-column applist-tbody-sub-row-column-detail" :class="linkClass(path)" @tap.native="navigate(path)">{{ content(path) }}</TextRegular>
        </StackLayout>
    </GridLayout>
</template>

<script>
    import { getContentComponentOptions } from "../../../assets/scripts/mixins/getcontent";
    import { AppListLinkNavigate } from "../../../assets/scripts/mixins/applistlink";

    export default {
        name: "AppListBodyColumnSubRow",
        props: {
            item: { type:Object,default:{ name:'Smart Sale' } },
            layout: { type:Object,default:{ Name:'name' } },
        },
        mixins: [getContentComponentOptions,AppListLinkNavigate],
        computed: {
            unique(){ return new Date().getTime() },
            key(){ return (colNo) => ['applist',this.unique,'head','column',colNo].join('-') },
            columns(){ return _.fill(Array(_.toArray(this.layout).length),'*').join(',') },
            content(){ return (path) => this.getContent(_.get(this.item,path)); },
        }
    }
</script>
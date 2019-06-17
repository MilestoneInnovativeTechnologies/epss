<!--suppress ALL -->
<template>
    <GridLayout :rows="rows" columns="*">
        <FlexBoxLayout flexDirection="columns" row="0" col="0" class="applist-thead">
            <FlexBoxLayout class="applist-thead-row">
                <TextBold class="applist-thead-column applist-column-no"> </TextBold>
                <AppListHeadColumns :headColumns="headColumns"></AppListHeadColumns>
                <TextBold v-if="hasAction" class="applist-thead-column applist-column-action">  </TextBold>
            </FlexBoxLayout>
        </FlexBoxLayout>
        <FlexboxLayout flexDirection="column" row="1" col="0" class="applist-tbody">
            <FlexBoxLayout class="applist-tbody-row" v-for="(item,rowNo) in items" :key="key(rowNo)">
                <TextBold class="applist-tbody-column applist-column-no">{{ rowNo + 1 }}</TextBold>
                <AppListBodyColumns :item="item" :layout="layout" :headColumnCount="headColumnCount" :links="links"></AppListBodyColumns>
                <AppListAction v-if="hasAction" class="applist-tbody-column applist-column-action" :link="detail" :props="linkProps(item)"></AppListAction>
            </FlexBoxLayout>
        </FlexboxLayout>
        <FlexBoxLayout row="2" col="0" class="applist-tfoot">
            <TextHighlight class="text-underline m-t-8 m-r-5 text-right" width="100%" @tap.native="loadMore">Load More</TextHighlight>
        </FlexBoxLayout>
    </GridLayout>
</template>

<script>
    export default {
        name: "AppList",
        props: {
            headRowHeight: { type:[Number,String],default:50 },
            layout: { type:Object,default:{ Name:'name' } },
            maxHeadContents: { type:Number,default:3 },
            data:{ type:[Array,Object],deault:[{ name:'ePlus' },{ name:'Smart Sale' }] },
            detail: { type:String,default:'' },
            props: { type:[String,Array],default:'id' },
            links: { type:Object,default:{} },
            limit: { type:Number,default:0 },
        },
        data(){ return {
            display:0,
        } },
        computed: {
            unique(){ return new Date().getTime() },
            key(){ return (rowNo) => ['applist',this.unique,'body','row',rowNo].join('-') },
            limited(){ return (this.limit !== 0 && _.toArray(this.data).length > this.limit) },
            rows(){ return [this.headRowHeight,'auto',this.limited ? 'auto' : 0].join(',') },
            headColumnCount(){ let headsLength = _.keys(this.layout).length; return (headsLength <= this.maxHeadContents) ? headsLength : this.maxHeadContents-1 },
            headColumns(){ return _.take(_.keys(this.layout),this.headColumnCount); },
            hasAction(){ return !_.isEmpty(this.detail); },
            items(){ return this.limited ? _.take(_.toArray(this.data),this.display): _.toArray(this.data) }
        },
        methods: {
            linkProps(item){ return this.hasAction ? _.pick(item,this.props) : {} },
            loadMore(){ this.display += _.toSafeInteger(this.limit) }
        },
        created() {
            this.display = this.limit === 0 ? _.toArray(this.data).length : this.limit;
        }
    }
</script>
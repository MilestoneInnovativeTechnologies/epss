<!--suppress ALL -->
<template>
    <GridLayout :rows="rows" columns="*">
        <FlexBoxLayout flexDirection="columns" row="0" col="0" class="applist-caption"><TextTitleSubSmall :text="title" /></FlexBoxLayout>
        <FlexBoxLayout flexDirection="columns" row="1" col="0" class="applist-thead">
            <FlexBoxLayout class="applist-thead-row">
                <TextBold class="applist-thead-column applist-column-no" text=" " />
                <AppListHeadColumns :headColumns="headColumns" />
                <AppListHeadAction v-if="hasAction" :action="action" class="applist-thead-column applist-column-action" @list-action="listAction" :collection="dataCollection" :items="dataItems.length" />
            </FlexBoxLayout>
        </FlexBoxLayout>
        <FlexBoxLayout flexDirection="column" row="2" col="0" class="applist-tbody">
            <FlexBoxLayout class="applist-tbody-row" v-for="(item,rowNo) in items" :key="key(rowNo,item)">
                <TextBold class="applist-tbody-column applist-column-no" :text="rowNo + 1" />
                <AppListBodyColumns :row="rowNo" :item="item" :layout="dataLayout" :headColumnCount="headColumnCount" :links="links" :updates="mUpdates" :cast="cast" />
                <AppListAction v-if="hasAction" class="applist-tbody-column applist-column-action" :action="action" :link="detail" :props="linkProps(item)" :rowno="rowNo" @list-action="listAction" :collection="dataCollection" />
            </FlexBoxLayout>
        </FlexBoxLayout>
        <FlexBoxLayout row="3" col="0" class="applist-tfoot">
            <TextHighlight class="text-underline m-t-8 m-r-5 text-right" width="100%" @tap.native="loadMore" text="Load More" />
        </FlexBoxLayout>
    </GridLayout>
</template>

<script>
    import {AppListDetailProps} from "../../../assets/scripts/mixins/applistdetailprops";
    import {AppListAction} from "../../../assets/scripts/mixins/applistactions";
    import {AppListUpdate} from "../../../assets/scripts/services/AppListUpdate";

    export default {
        name: "AppList",
        props: {
            headRowHeight: { type:[Number,String],default:50 },
            layout: { type:Object,default:()=>{ return {} } },
            maxHeadContents: { type:Number,default:3 },
            source:{ type:[Array,Object],default:() => [] },
            detail: { type:String,default:'' },
            props: { type:null,default:'id' },
            links: { type:Object,default:()=>{ return {} } },
            updates: { type:[Array,Object],default:() => [] },
            limit: { type:[Number,String],default:10 },
            title: { type:String,default:'' },
            cast: { type:Object,default:()=>{ return {} } },
        },
        mixins: [AppListDetailProps,AppListAction],
        data(){
            let mUpdates = new AppListUpdate().init(this.updates);
            return {
                display:0,
                dataItems:[],
                dataLimit:0,
                dataLayout:{ 'No Data':'name' },
                mUpdates,
        } },
        computed: {
            unique(){ return new Date().getTime() },
            key(){ return (rowNo,item) => ['applist',this.unique,'body','row',rowNo,this.itemCode(item)].join('-') },
            itemCode(){ return (item) => (this.action === 'remove') ? _.kebabCase(item[_.keys(item)[0]]) : '' },
            limited(){ return (!this.action && this.dataLimit !== 0 && this.dataItems.length > this.display) },
            rows(){ return [!this.title ? 0 : 'auto',this.headRowHeight,'auto',this.limited ? 'auto' : 0].join(',') },
            decent(){ return (this.maxHeadContents * 2) - 1 },
            headColumnCount(){ let headsLength = _.keys(this.dataLayout).length; return (headsLength <= this.maxHeadContents) ? headsLength : ( this.maxHeadContents - _.toSafeInteger(headsLength <= this.decent)) },
            headColumns(){ return _.take(_.keys(this.dataLayout),this.headColumnCount); },
            hasAction(){ return (!_.isEmpty(this.detail) || !!this.action); },
            items(){ return this.limited ? _.take(this.dataItems,this.display): this.dataItems },
        },
        methods: {
            setItems(data){ this.dataItems = _.isArray(data) ? data : _.toArray(data) },
            setLimit(limit){ this.dataLimit = _.toSafeInteger(limit); },
            loadMore(){ this.display += _.toSafeInteger(this.dataLimit) },
            getDataLayout(items){ return _.mapKeys(items,(item) => _.capitalize(item)) },
            updateDataItem(index,data){ for(let key in data) if(this.dataItems && _.has(this.dataItems,[index,key])) this.dataItems[index][key] = data[key]; },
        },
        created() {
            this.display = this.dataLimit === 0 ? this.dataItems.length : this.dataLimit;
            this.dataLayout = _.isEmpty(this.layout) ? this.getDataLayout(_.keys(_.head(this.dataItems))) : this.layout;
            EB.$on('applist-dataitem-update',({ index,data }) => this.updateDataItem(index,data));
        },
        beforeDestroy(){ EB.$off('applist-dataitem-update'); },
        watch: {
            source:{ deep:true,immediate:true,handler:'setItems' },
            limit:{ immediate:true,handler:'setLimit' },
        }
    }
</script>

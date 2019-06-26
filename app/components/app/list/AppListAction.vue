<!--suppress ALL -->
<template>
    <StackLayout class="cp">
        <AppListActionDetail v-if="link" class="applist-column-action-detail-icon" :link="link" :props="props"></AppListActionDetail>
        <AppListActionRemove v-else-if="action === 'remove'" @tap.native="$emit('list-action',{ action:'remove',row:rowno })"></AppListActionRemove>
        <AppListActionSelect v-else-if="action === 'select'" @tap.native="$emit('list-action',{ action:'select',row:rowno })" :status="status"></AppListActionSelect>
        <AppListActionPick v-else-if="action === 'pick'" @tap.native="$emit('list-action',{ action:'pick',row:rowno })" :status="status"></AppListActionPick>
        <TextRegular v-else> </TextRegular>
    </StackLayout>
</template>

<script>
    export default {
        name: "AppListAction",
        props: {
            link: { type:String,default:'' },
            props: { type:Object,default:()=>{ return {} } },
            action: { validator:(value) => ['remove','select','pick'].indexOf(value) > -1 },
            rowno: { type:Number },
            collection: { type:Array },
        },
        computed: {
            status(){ let row = this.rowno, collection = this.collection; return _.includes(collection,row); }
        },
    }
</script>
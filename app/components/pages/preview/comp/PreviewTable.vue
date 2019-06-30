<template>
    <GridLayout rows="auto,auto" columns="*" style="border-width: 1; border-right-width: 0; border-left-width: 0;">
        <GridLayout row="0" :columns="columns" style="border-bottom-width: 2">
            <TextBold :col="no" v-for="(key,head,no) in layout" :key="['pt',unique,'hc',no].join('-')" :text="head" class="p-y-8 p-x-10"></TextBold>
        </GridLayout>
        <GridLayout row="1" :rows="rows" columns="*">
            <GridLayout v-for="(item,row) in items" :row="row" col="0" :columns="columns" style="border-bottom-width: 1" :key="['pt',unique,'dr',row].join('-')">
                <TextRegular v-for="(key,head,no) in layout" :col="no" textWrap="true" :key="['pt',unique,'dr',row,'dc',no].join('-')" class="p-y-12 p-x-10">{{ item[key] }}</TextRegular>
            </GridLayout>
        </GridLayout>
    </GridLayout>

</template>

<script>
    export default {
        name: "PreviewTable",
        props: ['layout','items'],
        computed: {
            unique(){ return new Date().getTime(); },
            columns(){ let cols = _.size(this.layout),columns = _.fill(Array(cols),'*'); columns[0] = '2*'; return columns.join(','); },
            rows(){ let rowLen = _.size(this.items),row = _.fill(Array(rowLen),'auto'); return row.join(','); }
        }
    }
</script>
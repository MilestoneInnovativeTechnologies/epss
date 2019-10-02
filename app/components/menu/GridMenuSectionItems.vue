<template>
    <Label :text="items.length" />
<!--    <GridLayout  rows="auto" :columns="strAry(items.length).join(',')" class="m-b-2">-->
<!--        <GridMenuSectionItem v-for="(item,idx) in items" :key="'gmi'+idx" class="m-x-2" row="0" :col="idx" :item="item"></GridMenuSectionItem>-->
<!--    </GridLayout>-->
</template>

<script>
    export default {
        name: "GridMenuSectionItems",
        props: ['items'],
        methods: {
            strAry(n){ return _.fill(_.range(0,n),'*') },
        }
    }
</script>
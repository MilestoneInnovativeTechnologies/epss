<template>
    <GridLayout  rows="auto" :columns="colStar(menus.length)" class="m-b-2">
        <GridMenuItem v-for="(menu,idx) in menus" :key="'gmi'+idx" class="m-x-2" row="0" :col="idx" :menu="menu"></GridMenuItem>
    </GridLayout>
</template>

<script>
    export default {
        name: "GridMenuRow",
        props: ['menus'],
        computed:{
            colStar(){ return (n) => _.fill(_.range(0,n),'*').join() },
        },
    }
</script>

<style scoped>

</style>
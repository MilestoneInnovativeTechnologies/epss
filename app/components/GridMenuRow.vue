<template>
    <GridLayout  rows="auto" :columns="colStar(menus.length)" class="m-b-2">
        <StackLayout :borderRadius="item_border_radius" v-for="(menu,idx) in menus" class="bcp m-x-2 font-weight-bold text-center c-white fs18" :height="menu_height" row="0" :col="idx" :key="'mgr'+idx">
            <FontIcon class="m-t-12">{{ itemIcon(menu) }}</FontIcon>
            <TextBold class="c-white" style="color: #FFFFFF">{{ itemName(menu) }}</TextBold>
        </StackLayout>
    </GridLayout>
</template>

<script>
    import FontIcon from "./fonticon/FontIcon";
    import TextBold from "./typography/TextBold";
    export default {
        name: "GridMenuRow",
        components: {TextBold, FontIcon},
        props: ['menus'],
        data(){ return {
            menu_height: 80,
            item_border_radius: 5,
        } },
        computed:{
            colStar(){ return (n) => _.fill(_.range(0,n),'*').join() },
            itemName(){ return (n) => _.first(n) },
            itemIcon(){ return (n) => _.last(n) },
        },
    }
</script>

<style scoped>

</style>
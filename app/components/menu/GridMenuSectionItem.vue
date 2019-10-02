<template>
    <StackLayout :borderRadius="item_border_radius" class="bcp font-weight-bold text-center c-white fs18" :height="menu_height">
        <FontIcon class="m-t-12">{{ itemIcon }}</FontIcon>
        <TextBold class="c-white" style="color: #FFFFFF">{{ itemName }}</TextBold>
    </StackLayout>
</template>

<script>
    export default {
        name: "GridMenuSectionItem",
        props: ['item'],
        data(){ return {
            menu_height: 80,
            item_border_radius: 5,
        } },
        computed:{
            itemName(){ return this.item.home_display },
            itemIcon(){ return this.item.icon },
            navigate(){ return this.item.component + '.vue' },
        }
    }
</script>
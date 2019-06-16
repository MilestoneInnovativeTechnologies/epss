<template>
    <StackLayout @tap="$navigateTo(navigate)" :borderRadius="item_border_radius" class="bcp font-weight-bold text-center c-white fs18" :height="menu_height">
        <FontIcon class="m-t-12">{{ itemIcon }}</FontIcon>
        <TextBold class="c-white" style="color: #FFFFFF">{{ itemName }}</TextBold>
    </StackLayout>
</template>

<script>
    export default {
        name: "GridMenuItem",
        props: ['menu'],
        data(){ return {
            menu_height: 80,
            item_border_radius: 5,
        } },
        computed:{
            itemName(){ return _.head(this.menu) },
            itemIcon(){ return _.nth(this.menu,1) },
            navigate(){ return require('../' + _.nth(this.menu,2) + '.vue').default },
        }
    }
</script>

<style scoped>

</style>
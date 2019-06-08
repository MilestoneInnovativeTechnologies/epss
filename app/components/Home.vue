<!--suppress ALL -->
<template>
    <Page>
        <ActionBar title="My App">
            <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
        </ActionBar>
        <ScrollView>
            <StackLayout width="95%">
                <GridLayout rows="auto,auto" columns="auto,auto" class="m-t-20" width="90%">
                    <label :text="'fa-truck' | fonticon" class="fa cp t-25 m-r-10 m-t-8" rowSpan="2" row="0" col="0" />
                    <label text="Stores" class="fs c-grey-light" row="0" col="1" />
                    <StackLayout col="1" row="1" class="cp fs">
                        <label text="Store 1 Name" class="t-20 font-weight-bold" />
                        <label text="Store 2 Name" class="t-20 font-weight-bold"  />
                    </StackLayout>
                </GridLayout>
                <GridLayout rows="auto,auto" columns="auto,auto" class="m-t-20" width="90%">
                    <label :text="'fa-road' | fonticon" class="fa cp t-25 m-r-10 m-t-8" rowSpan="2" row="0" col="0" />
                    <label text="Area" class="fs c-grey-light" row="0" col="1" />
                    <StackLayout col="1" row="1" class="cp fs">
                        <label text="Area 1 Name" class="t-20 font-weight-bold" />
                        <label text="Area 2 Name" class="t-20 font-weight-bold"  />
                    </StackLayout>
                </GridLayout>
                <template v-for="(items,caption,sidx) in menus">
                    <Label :text="caption" class="fs font-weight-bold t-18 m-y-8 m-l-2 c-black" />
                    <GridLayout  rows="auto" :columns="colStar(items.length)" class="m-b-10">
                        <StackLayout :borderRadius="item_border_radius" v-for="(item,idx) in items" class="bcp m-x-2 font-weight-bold text-center c-white t-18" :height="menu_height" row="0" :col="idx">
                            <label :text="itemIcon(item) | fonticon" class="fa t-20 m-t-20" />
                            <label :text="itemName(item)" class="fs t-18" />
                        </StackLayout>
                    </GridLayout>
                </template>
            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: "Home",
        data(){ return {
            menu_height: 80,
            item_border_radius: 5,
        } },
        computed:{
            ...mapGetters('Menu',['sections','menus']),
            colStar(){ return (n) => _.fill(_.range(0,n),'*').join() },
            itemName(){ return (n) => _.head(n) },
            itemIcon(){ return (n) => _.get(n,1) },
        },
        methods: {
        },
        mounted() {
            log('Home Mounted');
        }
    }
</script>

<style scoped>

</style>
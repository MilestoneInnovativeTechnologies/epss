<!--suppress ALL -->
<template>
    <RadSideDrawer ref="drawer" drawerLocation="right" @drawerClosed="changeRadSideDrawerStatus(false)" :drawerContentSize="drawerContentSize" >
        <GridLayout rows="auto,auto,auto,*,auto,auto" columns="*" ~drawerContent class="bcp">
            <DrawerTitleBar row="0" col="0"></DrawerTitleBar>
            <DrawerProfileBar row="1" col="0"></DrawerProfileBar>
            <DrawerHomeNavigation row="2"></DrawerHomeNavigation>
            <ScrollView row="3" col="0"><DrawerMenu></DrawerMenu></ScrollView>
            <TextBold row="4" col="0" @tap.native="userLogout" class="w-full text-center p-y-15 c-bg-white" verticalAlignment="center">LOGOUT</TextBold>
            <TextRegular row="5" class="w-full text-center c-bg-grey" @tap.native="$navigateTo(require('./../Debug').default)"> DEBUG </TextRegular>
        </GridLayout>
        <StackLayout ~mainContent>
            <slot></slot>
        </StackLayout>
    </RadSideDrawer>
</template>

<script>
    import {logoutMixin} from "../../assets/scripts/mixins/logout";
    import {RadSideDrawerControl} from "../../assets/scripts/mixins/sidedrawer";

    export default {
        name: "Drawer",
        mixins: [logoutMixin,RadSideDrawerControl]
    }
</script>
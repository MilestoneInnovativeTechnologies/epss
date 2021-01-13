<template>
    <GridLayout rows="50" columns="50,*,50">
        <Label col="0" text=" "></Label>
        <TextHeading col="1" horizontalAlignment="center" verticalAlignment="center">MENU</TextHeading>
        <FontIcon col="2" name="close" size="35" class="c-black text-center" verticalAlignment="center" @tap.native="changeRadSideDrawerStatus(false)"></FontIcon>
    </GridLayout>
</template>

<script>
    import {RadSideDrawerControl} from "../../assets/scripts/mixins/sidedrawer";

    export default {
        name: "DrawerTitleBar",
        mixins: [RadSideDrawerControl]
    }
</script>

<template>
    <GridLayout columns="*,auto" backgroundColor="#FFFFFF" style="color: #FFFFFF">
        <Label col="0" text="||||||||||" @tap="$navigateTo(Debug)" />
        <StackLayout col="1" class="bcp p-y-5 p-x-12 m-r-2" orientation="horizontal" style="border-bottom-width: 1px; border-bottom-color: #FFFFFF" @tap="$navigateTo(require('./../Home').default)">
            <FontIcon class="m-r-5" name="home" size="18" />
            <TextBold class="c-white" text="HOME" />
        </StackLayout>
    </GridLayout>
</template>

<script>
    import { Debug } from '../../assets/scripts/navigations'
    export default {
        name: "DrawerHomeNavigation",
        data(){ return { Debug:Debug.default } },
    }
</script>

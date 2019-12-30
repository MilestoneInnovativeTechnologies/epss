<template>
    <GridLayout columns="*,auto" backgroundColor="#FFFFFF">
        <Label col="0" text="||||||||||" class="c-white" @tap="$navigateTo(Debug)" />
        <StackLayout col="1" class="bcp p-y-4 p-x-15" orientation="horizontal" style="border-bottom-width: 1px; border-bottom-color: #FFFFFF" @tap="$navigateTo(require('./../Home').default)">
            <FontIcon class="c-white" name="home" size="20"></FontIcon>
            <TextBold class="c-white m-l-4" style="color: #FFFFFF;">HOME</TextBold>
        </StackLayout>
    </GridLayout>
</template>

<script>
    import { Debug } from '../../assets/scripts/navigations'
    export default {
        name: "DrawerHomeNavigation",
        data(){ return { Debug } },
    }
</script>
<!--suppress ALL -->
<template>
    <GridLayout rows="40" columns="40,*,40" width="100%" class="bcp elevate-4">
        <FontIcon v-if="hasBack" col="0" name="navigate_before" size="32" class="text-left c-black" verticalAlignment="center" @tap.native="$navigateBack"></FontIcon>
        <Label text=" " col="0" v-else></Label>
        <TextHeading col="1" verticalAlignment="center" horizontalAlignment="center" :text="title" class="c-white" />
        <FontIcon v-if="hasDrawer" col="2" name="reorder" size="32" class="c-black text-center" verticalAlignment="center" @tap.native="changeRadSideDrawerStatus(true)"></FontIcon>
        <Label text=" " col="2" v-else></Label>
    </GridLayout>
</template>

<script>
    import {RadSideDrawerControl} from "../../assets/scripts/mixins/sidedrawer";

    export default {
        name: 'CustomActionBar',
        mixins: [RadSideDrawerControl],
        props: ['title','back','drawer'],
        computed: {
            hasBack(){ return (this.back !== 'false' && this.back !== false) },
            hasDrawer(){ return (this.drawer !== 'false' && this.drawer !== false) },
        },
    }
</script>

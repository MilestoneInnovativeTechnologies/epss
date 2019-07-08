<template>
    <GridLayout style="border-bottom-width: 1px; border-bottom-color: #FFFFFF" columns="4,*">
        <Label text="" col="0"></Label>
        <GridLayout col="1" rows="35" columns="*" class="p-l-16" backgroundColor="#FFBD7B" @tap="$navigateTo(require('./../'+items[item][2]).default)">
            <TextRegular col="0" row="0" verticalAlignment="center" class="text-uppercase">{{ items[item][3] }}</TextRegular>
        </GridLayout>
    </GridLayout>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "DrawerMenuSectionItem",
        props: ['item'],
        computed: mapState('Menu',['items'])
    }
</script>
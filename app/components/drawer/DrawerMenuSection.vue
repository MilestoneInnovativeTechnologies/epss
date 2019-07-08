<template>
    <StackLayout>
        <GridLayout rows="45" columns="*" style="border-bottom-width: 1px; border-bottom-color: #FFFFFF" class="p-l-20">
            <TextTitleSub row="0" col="0" verticalAlignment="center">{{ section }}</TextTitleSub>
        </GridLayout>
        <DrawerMenuSectionItem v-for="(item,idx) in items" :item="item" :key="['dmsi',no,idx].join('-')"></DrawerMenuSectionItem>
    </StackLayout>
</template>

<script>
    export default {
        name: "DrawerMenuSection",
        props: ['section','items','no']
    }
</script>
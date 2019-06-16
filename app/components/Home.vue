<!--suppress ALL -->
<template>
    <App title="User Name">
        <UserStores width="90%"></UserStores>
        <UserAreas width="90%"></UserAreas>
        <template v-for="(items,caption,sidx) in menus">
            <TextTitleSub class="m-t-12 m-b-8 m-l-2">{{ caption }}</TextTitleSub>
            <GridMenuRow :menus="items"></GridMenuRow>
        </template>
    </App>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: "Home",
        computed: {
            ...mapGetters('Menu', ['menus']),
        }
    }
</script>
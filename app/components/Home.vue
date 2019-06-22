<!--suppress ALL -->
<template>
    <App :title="name">
        <UserStoresInfoWithIcon width="90%"></UserStoresInfoWithIcon>
        <UserAreasInfoWithIcon width="90%"></UserAreasInfoWithIcon>
        <TextTitleSub width="90%" class="m-t-20 cp">Outstandings</TextTitleSub>
        <UserCustomerTotalOutstandingMetric width="90%"></UserCustomerTotalOutstandingMetric>
        <TextTitleSub width="90%" class="m-t-20 cp">Sales Orders</TextTitleSub>
        <SalesOrderPendingMetric width="90%" class="m-b-10"></SalesOrderPendingMetric>
        <template v-for="(items,caption,sidx) in menus">
            <TextTitleSub class="m-t-12 m-b-8 m-l-2">{{ caption }}</TextTitleSub>
            <GridMenuRow :menus="items"></GridMenuRow>
        </template>
    </App>
</template>

<script>
    import { mapState,mapGetters } from 'vuex'
    export default {
        name: "Home",
        computed: {
            ...mapGetters('Menu', ['menus']),...mapState('User', ['name','email']),
        }
    }
</script>
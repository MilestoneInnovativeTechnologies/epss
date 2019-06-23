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
    import {mapState, mapGetters, mapActions} from 'vuex'
    import {
        user_assigned_area_customers, user_assigned_customer_sales_orders,
        user_assigned_store_areas,
        user_assigned_stores
    } from "../assets/scripts/queries";

    export default {
        name: "Home",
        computed: {
            ...mapGetters('Menu', ['menus']), ...mapState('User', ['id', 'name', 'email']),
        },
        methods: {
            ...mapActions({
                storeStock: 'Stores/_stockIfNot',
                areaStock: 'Areas/_stockIfNot',
                customerStock: 'Customer/_stockIfNot',
                soStock: 'SalesOrder/_stockIfNot'
            })
        },
        created() {
            let methodQuery = {
                store: user_assigned_stores,
                area: user_assigned_store_areas,
                customer: user_assigned_area_customers,
                so: user_assigned_customer_sales_orders
            }
            _.forEach(methodQuery, (query, method) => this[method + 'Stock']({
                query: sql.format(query, this.id),
                key: 'list'
            }))
        }
    }
</script>
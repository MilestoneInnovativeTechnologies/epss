<template>
    <StackLayout>
        <StackLayout class="m-t-20" v-if="settings('home_screen_out_standing') === 'Yes'">
            <TextTitleSub class="cp">Outstandings</TextTitleSub>
            <UserCustomerTotalOutstandingMetric width="90%"></UserCustomerTotalOutstandingMetric>
        </StackLayout>
        <StackLayout class="m-t-20" v-if="settings('home_screen_sales_order_progress') === 'Yes'">
            <TextTitleSub class="cp">Sales Orders</TextTitleSub>
            <SalesOrderPendingMetric width="90%" class="m-b-10"></SalesOrderPendingMetric>
        </StackLayout>
    </StackLayout>
</template>

<script>
    export default {
        name: "HomeWidgets",
        methods: {
            settings(name){ return this.$store.getters['Settings/setting'](name) },
        }
    }
</script>
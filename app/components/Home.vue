<!--suppress ALL -->
<template>
    <App :title="name">
        <UserStoresInfoWithIcon width="90%"></UserStoresInfoWithIcon>
        <UserAreasInfoWithIcon width="90%"></UserAreasInfoWithIcon>
        <TextTitleSub width="90%" class="m-t-20 cp">Outstandings</TextTitleSub>
        <UserCustomerTotalOutstandingMetric width="90%" :key="'ctos'+uKey"></UserCustomerTotalOutstandingMetric>
        <TextTitleSub width="90%" class="m-t-20 cp">Sales Orders</TextTitleSub>
        <SalesOrderPendingMetric width="90%" class="m-b-10" :key="'cspm'+uKey"></SalesOrderPendingMetric>
        <template v-for="(items,caption,sidx) in menus">
            <TextTitleSub class="m-t-12 m-b-8 m-l-2">{{ caption }}</TextTitleSub>
            <GridMenuRow :menus="items"></GridMenuRow>
        </template>
        <AppButton @tap.native="userLogout" class="m-t-15 c-white">LOGOUT</AppButton>
    </App>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex'
    import {
        user_assigned_area_customers, user_assigned_customer_sales_orders,
        user_assigned_store_areas, user_assigned_stores
    } from "../assets/scripts/queries";
    import {logoutMixin} from "../assets/scripts/mixins/logout";

    export default {
        name: "Home",
        mixins: [logoutMixin],
        data(){ return {
            uKey: 0,
        }},
        computed: {
            ...mapGetters('Menu', ['menus']), ...mapState('User', ['id','name']),
        },
        methods: {
            ...mapActions({
                storeStock: 'Stores/_stockIfNot',
                areaStock: 'Areas/_stockIfNot',
                customerStock: 'Customer/_stockIfNot',
                soStock: 'SalesOrder/_stockIfNot',
            }),
            start(){
                let methodQuery = { store: user_assigned_stores, area: user_assigned_store_areas, customer: user_assigned_area_customers, so: user_assigned_customer_sales_orders }
                _.forEach(methodQuery, (query, method) => this[method + 'Stock']({ query: sql.format(query, this.id) }));
                setTimeout((vm) => { vm.uKey = __.now(); },1500,this)
            },
            login(){
                this.$navigateTo(require('./login/Login').default,{ backstackVisible:false });
            }
        },
        mounted: function () {
            let vm = this;
            this.$nextTick(function () {
                if(vm.id){ this.start() }
                else { setTimeout(() => vm.login(),2000); }
            })
        }
    }
</script>
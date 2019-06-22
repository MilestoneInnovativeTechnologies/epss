<template>
    <App title="Customers">
        <AppList :source="list" :layout="layout" detail="customer/CustomerDetail"></AppList>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex'
    import {user_assigned_area_customers} from "../../../assets/scripts/queries";

    export default {
        name: "CustomerIndex",
        props: ['id'],
        data(){ return {
            key: 'list', path: '',
            layout: { Name:'name', Phone:'phone' }
        } },
        computed: {
            ...mapState('User',['id']),...mapState('Customer',['list']),
        },
        methods: {
            ...mapActions('Customer',['_stockIfNot'])
        },
        created() {
            let query = sql.format(user_assigned_area_customers,this.id);
            this._stockIfNot({ query:query,path:this.path,key:this.key })
        }
    }
</script>
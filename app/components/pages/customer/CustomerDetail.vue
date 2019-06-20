<template>
    <App title="Customer Detail">
        <TextTitle>{{ customer.name }}</TextTitle>
        <TextTitleSub>{{ customer.code }}</TextTitleSub>
        <AppInfoWide title="Phone">{{ customer.phone }}</AppInfoWide>
        <AppInfoWide title="Email">{{ customer.email }}</AppInfoWide>
    </App>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "CustomerDetail",
        props: ['id'],
        data(){ return {

        } },
        computed:{
            ...mapGetters('Customer',['_tableDataItem']),
            customer(){ return this._tableDataItem('users',this.id) },
        },
        methods: {

        },
    }
</script>
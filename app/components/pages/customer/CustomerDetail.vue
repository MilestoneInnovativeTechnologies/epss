<template>
    <App title="Customer Detail">
        <TextTitle>{{ customer.name }}</TextTitle>
        <TextTitleSub>{{ customer.code }}</TextTitleSub>
            <GridLayout rows="auto" columns="2*,*">
                <TextBold row="0" col="0" class="text-left">{{ customer.phone }}</TextBold>
                <TextHeadingRowSub row="0" col="1" class="text-right">Phone</TextHeadingRowSub>
            </GridLayout>
            <GridLayout rows="auto" columns="2*,*">
                <TextBold row="0" col="0" class="text-left">{{ customer.email }}</TextBold>
                <TextHeadingRowSub row="0" col="1" class="text-right">Email</TextHeadingRowSub>
            </GridLayout>
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
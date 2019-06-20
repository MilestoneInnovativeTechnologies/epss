<template>
    <App title="Customer Detail"></App>
<!--    <TextTitle>{{ customer.name }}</TextTitle>-->
<!--    <TextTitleSub>{{ customer.code }}</TextTitleSub>-->
<!--    <GridLayout rows="auto" columns="2*,*">-->
<!--        <TextBold row="0" col="0">{{ customer.phone }}</TextBold>-->
<!--        <TextHeadingRowSub row="0" col="1">Phone</TextHeadingRowSub>-->
<!--    </GridLayout>-->
<!--    <GridLayout rows="auto" columns="2*,*">-->
<!--        <TextBold row="0" col="0">{{ customer.email }}</TextBold>-->
<!--        <TextHeadingRowSub row="0" col="1">Email</TextHeadingRowSub>-->
<!--    </GridLayout>-->
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "CustomerDetail",
        props: ['id'],
        data(){ return {

        } },
        computed:{
            ...mapGetters('Customer',['_tableDataItem','customers']),
            customer(){ return this._tableDataItem('users',this.id) },
        },
        methods: {

        },
    }
</script>
<template>
    <App title="Customers">

    </App>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "CustomerIndex",
        props: ['id'],
        data(){ return {

        } },
        computed:{
            ...mapGetters('Customer',[]),
        },
        methods: {

        },
    }
</script>
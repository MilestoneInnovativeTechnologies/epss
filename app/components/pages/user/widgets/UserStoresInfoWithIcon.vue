<template>
    <InfoWithIcon heading="Stores" icon="store_mall_directory" :contents="stores"></InfoWithIcon>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "UserStoresInfoWithIcon",
        computed: {
            ...mapState('Stores',['list']),
            stores(){ return _.map(this.list,'name') }
        }
    }
</script>
<template>
    <InfoWithIcon heading="Stores" icon="store_mall_directory" :contents="myStores"></InfoWithIcon>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "UserStoresInfoWithIcon",
        computed: {
            ...mapGetters('User',['stores']), ...mapGetters('Stores',['_tableDataByIdName']),
            myStores(){ return _.values(_.pick(this._tableDataByIdName('stores'),this.stores)) }
        }
    }
</script>

<style scoped>

</style>
<template>
    <InfoWithIcon heading="Stores" icon="store_mall_directory" :contents="myStores"></InfoWithIcon>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "UserStoresInfoWithIcon",
        computed: {
            ...mapGetters('User',['stores']), ...mapGetters('Stores',['_tableDataById']),
            myStores(){ return _.map(_.pick(this._tableDataById('stores'),this.stores),'name') }
        }
    }
</script>

<style scoped>

</style>
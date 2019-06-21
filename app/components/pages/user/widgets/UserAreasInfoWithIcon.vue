<template>
    <InfoWithIcon heading="Areas" icon="map" :contents="myAreas"></InfoWithIcon>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "UserAreasInfoWithIcon",
        computed: {
            ...mapGetters('User',['areas']), ...mapGetters('Areas',['_tableDataByIdName']),
            myAreas(){ return _.values(_.pick(this._tableDataByIdName('areas'),this.areas)) },
        },
    }
</script>

<style scoped>

</style>
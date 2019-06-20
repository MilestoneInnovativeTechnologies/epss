<template>
    <InfoWithIcon heading="Areas" icon="map" :contents="myAreas"></InfoWithIcon>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "UserAreasInfoWithIcon",
        computed: {
            ...mapGetters('User',['areas','customers']), ...mapGetters('Areas',['_tableDataById']),
            myAreas(){ return _.map(_.pick(this._tableDataById('areas','id'),this.areas),'name') },
        },
    }
</script>

<style scoped>

</style>
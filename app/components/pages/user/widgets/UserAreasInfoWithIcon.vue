<template>
    <InfoWithIcon heading="Areas" icon="map" :contents="areas"></InfoWithIcon>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "UserAreasInfoWithIcon",
        computed: {
            ...mapState('Areas',['list']),
            areas(){ return _.map(this.list,'name') },
        },
    }
</script>
<template>
    <InfoWithIcon heading="Areas" icon="map" :contents="areas"></InfoWithIcon>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapGetters } = createNamespacedHelpers('Areas');
    export default {
        name: "UserAreas",
        computed: {
            ...mapGetters(['areas']),
        }
    }
</script>
<template>
    <InfoWithIcon heading="Stores" icon="store_mall_directory" :contents="stores"></InfoWithIcon>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapGetters } = createNamespacedHelpers('Stores');
    export default {
        name: "UserStores",
        computed: {
            ...mapGetters(['stores']),
        }
    }
</script>
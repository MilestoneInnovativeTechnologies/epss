<!--suppress ALL -->
<template>
    <App title="Stores">
        <AppList :source="stores" detail="store/StoreDetail" :layout="{ Name:'name' }" class="m-t-10"></AppList>
    </App>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: "StoreIndex",
        computed: {
            ...mapGetters('Stores',['stores']),
        }
    }
</script>
<!--suppress ALL -->
<template>
    <App title="Stores">
        <AppList :source="list" detail="store/StoreDetail" :layout="{ Name:'name' }" class="m-t-10"></AppList>
    </App>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "StoreIndex",
        computed: {
            ...mapState('Stores',['list']),
        }
    }
</script>
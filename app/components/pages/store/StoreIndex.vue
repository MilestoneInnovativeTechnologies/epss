<!--suppress ALL -->
<template>
    <App title="Stores">
        <Label height="50"> YoYo </Label>
        <AppList :data="stores" detail="store/StoreDetail" :props="['id','created_at']" :layout="{ ID:'id',Name:'name',Created:'created_at',UPDATED:'updated_at' }" :links="{ updated_at:['store/StoreDetail','id','updated_at'] }"></AppList>
    </App>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: "StoreIndex",
        computed: {
            ...mapGetters('Stores',['_dataById']),
            stores(){ return this._dataById('stores'); }
        }
    }
</script>
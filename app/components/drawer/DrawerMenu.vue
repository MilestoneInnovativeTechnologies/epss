<template>
    <StackLayout class="bcp">
        <DrawerMenuSection v-for="(items,name,idx) in category" :key="['dms',idx].join('-')" :section="name" :items="items" :no="idx"></DrawerMenuSection>
    </StackLayout>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "DrawerMenu",
        computed: mapState('Menu',['category']),
    }
</script>
<template>
    <StackLayout class="bcp" v-if="section_items.length">
        <DrawerMenuSection v-for="(section,idx) in sections" :key="['dmgs',idx].join('-')" :section="section" :items="section_items[idx]" :no="idx"></DrawerMenuSection>
    </StackLayout>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "DrawerMenu",
        computed: mapState('Menu',['content','sections','section_items'])
    }
</script>
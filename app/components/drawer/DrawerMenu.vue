<template>
    <StackLayout class="bcp" v-if="content && all_section_items.length">
        <DrawerMenuSection v-for="(section,idx) in all_sections" :key="['dmgs',idx].join('-')" :section="section" :items="all_section_items[idx]" :no="idx"></DrawerMenuSection>
    </StackLayout>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "DrawerMenu",
        computed: {
            ...mapState('Menu', ['content','sections', 'section_items', 'commons', 'common_items']),

            all_section_items() { return [].concat(this.section_items, this.common_items) },
            all_sections() { return [].concat(this.sections, this.commons) },
        }
    }
</script>
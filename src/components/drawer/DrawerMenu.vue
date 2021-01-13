<template>
    <StackLayout class="bcp" v-if="content && all_section_items.length">
        <DrawerMenuSection v-for="(section,idx) in all_sections" :key="['dmgs',idx].join('-')" :section="section" :items="all_section_items[idx]" :no="idx"></DrawerMenuSection>
    </StackLayout>
</template>

<script>
    import {mapState,mapGetters} from 'vuex';

    export default {
        name: "DrawerMenu",
        computed: {
            ...mapState('Menu', ['content','sections', 'section_items', 'commons', 'common_items']),
            ...mapGetters('Menu', ['conditional', 'conditional_items']),
            all_section_items() { return [].concat(this.section_items, this.conditional_items.filter(items => items.length), this.common_items) },
            all_sections() { return [].concat(this.sections, this.conditional.filter((m,idx) => this.conditional_items[idx] && this.conditional_items[idx].length), this.commons) },
        }
    }
</script>
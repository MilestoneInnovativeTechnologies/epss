<template>
    <StackLayout class="m-t-12" v-if="content" :width="width" :key="'hm-lyt-'+uKey">
        <GridMenuSection v-for="(title,idx) in sections" :key="['hmgs',1,idx].join('-')" :title="title" :items="section_items[idx]" :height="height" :space="spacing" />
        <GridMenuSection class="m-b-15 m-y-15" v-for="(title,idx) in conditional" :key="['hmgs',2,idx].join('-')" :title="title" :items="conditional_items[idx]" :height="height" :space="spacing" />
        <GridMenuSection v-for="(title,idx) in commons" :key="['hmgs',3,idx].join('-')" :title="title" :items="common_items[idx]" :height="height" :space="spacing" />
    </StackLayout>
</template>

<script>
    import { mapState,mapActions,mapMutations,mapGetters } from 'vuex';
    import {get_all_active_menu_in_order} from "../../assets/scripts/queries";
    import {set_state_data} from "../../assets/scripts/vuex/mutation-types";

    export default {
        name: "HomeMenu",
        data(){ return {
            height: 80,
            spacing: 2,
            minWidth: 120,
            maxWidth: 430,
            uKey: 0,
        } },
        computed: {
            ...mapState('Menu',['content','sections','section_items','commons','common_items']), ...mapState('App',{ scrWidth:'width' }),
            ...mapGetters('Menu',['conditional','conditional_items']),
            maxItems(){ return _.max(_.map(this.section_items,(sAry) => sAry.length)) },
            width(){ return (_.toSafeInteger(this.scrWidth) > this.maxWidth) ? this.maxWidth : '100%' }
        },
        methods: {
            ...mapActions('Menu',{ stockMenu:'_stock' }), ...mapMutations('Menu',[set_state_data]),
            stockMenuContents(){
                this.stockMenu({ query: sql.format(get_all_active_menu_in_order), key:'content' })
                    .then(res => this.populateMenuItems(res));
            },
            addToSection(name){
                let sections = this.sections, idx = sections.push(name);
                this[set_state_data]({ sections }); return idx-1;
            },
            populateMenuItems(res){
                let vm = this, sIdx = 0;
                _.forEach(res,(Obj,idx) => {
                    sIdx = vm.sections.indexOf(Obj.category_display);
                    sIdx = (sIdx < 0) ? vm.addToSection(Obj.category_display) : sIdx;
                    vm.addSectionItem(sIdx,Obj);
                });
                this.uKey++;
            },
            addSectionItem(sIdx,Obj){
                let section_items = this.section_items;
                if(!section_items[sIdx]) section_items[sIdx] = [];
                if(_.map(section_items[sIdx],'id').indexOf(Obj.id) < 0){
                    section_items[sIdx].push(Obj);
                    this[set_state_data]({ section_items });
                }
            },
        },
        mounted(){
            if(!this.content){ this.stockMenuContents(); }
            else if(_.isEmpty(this.sections)) { this.populateMenuItems(this.content); }
            else this.uKey++;
        }
    }
</script>
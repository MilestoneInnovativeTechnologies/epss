<template>
    <ScrollView>
        <WrapLayout>
            <TRAItem :isUserInteractionEnabled="interaction" :width="itemWidth" :height="itemHeight" :priceWidth="priceWidth" v-if="item" v-for="item in items" :item="item" :key="'list-product-'+item.id" :class="itemClass"></TRAItem>
        </WrapLayout>
    </ScrollView>
</template>

<script>
    import { mapState } from 'vuex';
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";

    export default {
        name: "TRAItems",
        mixins: [EventListeners],
        data(){ return {
            events:['number-pad'],
            interaction: true,
        } },
        props: ['items','properties'],
        computed: {
            ...mapState('App',{ screenWidth: 'width' }),
            itemsPerRow(){ return _.toSafeInteger(this.properties.itemsPerRow) },
            itemSpacing(){ return _.toSafeInteger(this.properties.itemSpacing) },
            itemClass(){ let space = this.itemSpacing; return ['m-r-'+space,'m-b-'+space]; },
            itemsWidth(){
                let sw = _.toSafeInteger(this.screenWidth), prop = this.properties, cw = _.toSafeInteger(sw * parseInt(prop.container)/100);
                return cw - (prop.leftPortion + prop.leftToRightSpace + prop.list01 + (prop.containerPadding * 2))
            },
            itemsHeight(){ },
            itemWidth(){ return _.floor((this.itemsWidth - (this.itemSpacing*this.itemsPerRow))/this.itemsPerRow); },
            itemHeight(){ return _.round(this.itemWidth * _.toNumber(this.properties.widthHeightRation)); },
            priceWidth(){ return _.floor(this.itemHeight - this.itemWidth) }
        },
        methods: {
            listener0(data){ this.interaction = !data; },
        }
    }
</script>
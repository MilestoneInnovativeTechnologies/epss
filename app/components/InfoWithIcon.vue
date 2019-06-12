<template>
    <GridLayout rows="auto,auto" columns="auto,auto" class="m-t-20">
        <FontIcon rowSpan="2" col="0" row="0" class="cp m-r-10 m-t-8" size="32">{{ icon }}</FontIcon>
        <TextHeadingInfoWithIcon col="1" row="0">{{ heading }}</TextHeadingInfoWithIcon>
        <StackLayout col="1" row="1">
            <TextHighlightBold v-for="(item,idx) in items" :key="'iwi'+idx">{{ item }}</TextHighlightBold>
        </StackLayout>
    </GridLayout>
</template>

<script>
    export default {
        name: "InfoWithIcon",
        props: ['icon','heading','contents'],
        computed: {
            slotContent(){ let st = _.get(this.$slots.default,'0.text'); return st ? [st] : null },
            items(){ return this.slotContent || (_.isArray(this.contents) ? this.contents : [this.contents]); },
        }
    }
</script>
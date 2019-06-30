<template>
    <AbsoluteLayout>
        <StackLayout width="100%">
            <AppList :source="source" :layout="layout" action="remove" @collection="$emit('collection',$event)"></AppList>
            <TextHighlight v-show="!ffActive" class="text-underline m-t-8 m-r-5 text-right" width="100%" @tap.native="alterActive">Add Item</TextHighlight>
        </StackLayout>
        <StackLayout width="100%" top="400%" :visibility="visible">
            <AppFloatForm :fields="fields" action="Add Product" @close="alterActive" :labels="labels" :labelValues="labelValues" v-on="$listeners" :key="instance"></AppFloatForm>
        </StackLayout>
    </AbsoluteLayout>
</template>

<script>
    export default {
        name: "AppFormDetail",
        props: ['source','layout','fields','labels','labelValues','instance'],
        data(){ return {
            ffActive: false,
            visibilityAlter: { hidden:'visible',visible:'hidden' },
        }},
        computed: {
            visible(){ return _.keys(this.visibilityAlter)[_.toSafeInteger(this.ffActive)] },
        },
        methods: {
            alterActive(){ this.ffActive = !this.ffActive; this.$emit('ff-active',this.ffActive); },
            collection(payload){ this.$emit('collection',payload) },
            done(payload){ this.$emit('done',payload) },
        }
    }
</script>
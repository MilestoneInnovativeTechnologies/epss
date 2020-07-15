<template>
    <Label :text="icon | fonticon" :class="icnClass" v-bind="$attrs" />
</template>

<script>
    export default {
        name: "FontIcon",
        props: ['name','size'],
        computed: {
            icon(){ return this.name || _.get(this.$slots.default,'0.text','menu') },
            icnClass(){ return ['mi','fs'+(this.size || 25)] }
        }
    }
</script>

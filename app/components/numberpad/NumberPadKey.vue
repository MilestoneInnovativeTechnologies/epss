<template>
    <Label v-if="icon" :height="height" :width="width" :class="cls" :text="icon | fonticon" />
    <Label v-else :height="height" :width="width" :class="cls">{{ text }}</Label>
</template>

<script>
    export default {
        name: "NumberPadKey",
        props: ['text','icon'],
        data(){ return {
            height: 75, width: 75, class: ['bcp','m-2','p-t-15','text-center','font-weight-bold','c-white fs28'],
        } },
        computed: {
            cls(){ return this.class.concat(this.icon ? 'mi' : 'fsb') }
        }
    }
</script>
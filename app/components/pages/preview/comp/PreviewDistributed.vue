<template>
    <WrapLayout>
        <PreviewDistributedItem v-for="(text,title,no) in items" :title="title" :key="['pdi',unique,no].join('-')" class="m-b-10" width="50%" :right="no%2" @print="printCmd[no] = $event">{{ text }}</PreviewDistributedItem>
    </WrapLayout>
</template>

<script>
    export default {
        name: "PreviewDistributed",
        props: ['items'],
        data(){ return {
            printCmd: [],
        }},
        computed: {
            unique(){ return new Date().getTime() },
        },
        mounted(){
            let vm = this;
            this.$nextTick(() => {
                let printCmd = vm.printCmd.filter(array => array).flatMap(array => array.concat(printer.LF(1))).slice(0,-1);
                vm.$emit('print',printCmd);
            })
        }
    }
</script>
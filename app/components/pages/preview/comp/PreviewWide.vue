<template>
    <StackLayout>
        <PreviewWideItem v-for="(text,title,no) in items" :title="title" :key="['pwi',unique,no].join('-')" class="m-b-5" @print="printCmd[no] = $event">{{ text }}</PreviewWideItem>
    </StackLayout>
</template>

<script>
    export default {
        name: "PreviewWide",
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
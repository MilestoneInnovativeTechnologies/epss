<template>
    <App title="Print Preview" action="Print" @print="doPrint">
        <PreviewHead class="m-b-15" @print="printHead = $event"></PreviewHead>
        <TextHeading v-if="title" style="width: 100%; text-align: center" class="m-b-15">{{ title }}</TextHeading>
        <slot></slot>
        <template v-if="template">
            <component v-for="(compAry,no) in template" :is="properComponent(compAry[0])" v-bind="compAry[1]" :key="['pt',unique,no].join('-')" class="m-b-15" @print="printCmd[no] = $event"></component>
        </template>
        <PreviewFooter class="m-t-20" @print="printFooter = $event"></PreviewFooter>
    </App>
</template>

<script>
    export default {
        name: "Preview",
        props: ['title','template'],
        data(){ return {
            printHead: [],
            printCmd: [],
            printFooter: [],
            printData: null,
        }},
        computed: {
            unique(){ return new Date().getTime() }
        },
        methods: {
            properComponent(comp){ return 'Preview' + _.upperFirst(comp); },
            doPrint(){ print(this.printData); this.$navigateBack(); }
        },
        mounted(){
            let vm = this;
            this.$nextTick(() => {
                let printData = [].concat(printer.CENTERON(),vm.printHead,printer.LF(1),printer.CENTERON(),printer.HL());
                printData = printData.concat(printer.LF(1),printer.CENTERON(),printer.TEXT(vm.title),printer.LF(2),printer.CENTEROFF());
                printData = printData.concat(vm.printCmd.filter(array => array).flatMap(array => array.concat(printer.LF(1))).slice(0,-1));
                printData = printData.concat(printer.LF(2),printer.CENTERON(),printer.HL(),printer.LF(1),printer.CENTERON(),vm.printFooter);
                vm.printData = printData;
            })
        }
    }
</script>
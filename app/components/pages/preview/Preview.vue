<template>
    <Page actionBarHidden="true" backgroundSpanUnderStatusBar="false">
        <GridLayout rows="*,60">
            <ScrollView row="0">
                <StackLayout width="95%">
                    <PreviewHead class="m-b-15" @print="printHead = $event"></PreviewHead>
                    <TextHeading v-if="title" style="width: 100%; text-align: center" class="m-b-15">{{ title }}</TextHeading>
                    <slot></slot>
                    <template v-if="template">
                        <component v-for="(compAry,no) in template" :is="properComponent(compAry[0])" v-bind="compAry[1]" :key="['pt',unique,no].join('-')" class="m-b-15" @print="printCmd[no] = $event"></component>
                    </template>
                    <PreviewFooter class="m-t-20" @print="printFooter = $event"></PreviewFooter>
                </StackLayout>
            </ScrollView>
            <StackLayout row="1" orientation="horizontal"><AppButton @tap.native="doPrint">PRINT</AppButton></StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import AppButton from "../../button/AppButton";
    export default {
        name: "Preview",
        components: {AppButton},
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
            doPrint(){ print(this.printData) }
        },
        mounted(){
            let vm = this;
            this.$nextTick(() => {
                let printData = [].concat(printer.CENTERON(),vm.printHead,printer.LF(1),printer.CENTERON(),printer.HL());
                printData = printData.concat(printer.LF(1),printer.CENTERON(),printer.TEXT(vm.title),printer.LF(2),printer.CENTEROFF());
                printData = printData.concat(vm.printCmd.filter(array => array).flatMap(array => array.concat(printer.LF(1))).slice(0,-1));
                printData = printData.concat(printer.LF(3),printer.CENTERON(),printer.HL(),printer.LF(1),printer.CENTERON(),vm.printFooter);
                vm.printData = printData;
            })
        }
    }
</script>
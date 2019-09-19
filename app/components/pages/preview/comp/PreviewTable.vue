<template>
    <GridLayout rows="auto,auto" columns="*" style="border-width: 1; border-right-width: 0; border-left-width: 0;">
        <GridLayout row="0" :columns="columns" style="border-bottom-width: 2">
            <TextBold :col="no" v-for="(key,head,no) in layout" :key="['pt',unique,'hc',no].join('-')" :text="head" class="p-y-8 p-x-10"></TextBold>
        </GridLayout>
        <GridLayout row="1" :rows="rows" columns="*">
            <GridLayout v-for="(item,row) in items" :row="row" col="0" :columns="columns" style="border-bottom-width: 1" :key="['pt',unique,'dr',row].join('-')">
                <TextRegular v-for="(key,head,no) in layout" :col="no" textWrap="true" :key="['pt',unique,'dr',row,'dc',no].join('-')" class="p-y-12 p-x-10" style="vertical-align: center">{{ item[key] }}</TextRegular>
            </GridLayout>
        </GridLayout>
    </GridLayout>
</template>

<script>
    export default {
        name: "PreviewTable",
        props: ['layout','items'],
        data(){ return {
            lineMaxLength: 16,
            lines: [],
            lineExtra: []
        } },
        computed: {
            unique(){ return new Date().getTime(); },
            columns(){ let cols = _.size(this.layout),columns = _.fill(Array(cols),'*'); columns[0] = '2*'; return columns.join(','); },
            rows(){ let rowLen = _.size(this.items),row = _.fill(Array(rowLen),'auto'); return row.join(','); }
        },
        methods: {
            addToPrintLine(row,col,content){
                if(!this.lines[row]) this.lines[row] = [];
                if(!this.lines[row][col]) this.lines[row][col] = [];
                if(this.needContentSplit(content)){
                    let contentParts = this.contentSplit(content);
                    this.lines[row][col] = contentParts[0]; let rContentParts = contentParts.slice(1);
                    if(!this.lineExtra[row]) this.lineExtra[row] = Array(rContentParts.length);
                    _.forEach(rContentParts,(rContent,sRow) => {
                        if(!this.lineExtra[row][sRow]){ this.lineExtra[row][sRow] = [] }
                        this.lineExtra[row][sRow][col] = rContent;
                    });
                } else {
                    this.lines[row][col] = content;
                }
            },
            needContentSplit(content){ return (content.toString().length > this.lineMaxLength); },
            contentSplit(content){
                let retPart = [''], entryIndex = 0;
                let cArray = content.toString().split(" ");
                for(let i = 0; i < cArray.length; i++){
                    if(retPart[entryIndex].length + cArray[i].toString().length > this.lineMaxLength) retPart[++entryIndex] = '';
                    retPart[entryIndex] = [retPart[entryIndex],cArray[i]].join(" ");
                }
                return retPart;
            }
        },
        mounted(){
            let vm = this;
            this.$nextTick(() => {
                _.forEach(vm.items,(item,row) => {
                    let keys = _.values(vm.layout);
                    _.forEach(keys,(key,col) => {
                        vm.addToPrintLine(row,col,item[key]);
                    })
                });
                let printCmd = []
                    .concat(printer.HL()).concat(printer.LF(1))
                    .concat(printer.TEXT(Object.keys(vm.layout).join("\t")))
                    .concat(printer.LF(1),printer.HL());
                _.forEach(vm.lines,(colArray,row) => {
                    printCmd = printCmd.concat(printer.LF(1)).concat(printer.TEXT(colArray.filter(col => col).join("\t")));
                    if(vm.lineExtra[row]){
                        let extra = _.filter(vm.lineExtra[row]);
                        _.forEach(extra,(sRow) => {
                            printCmd = printCmd.concat(printer.LF(1)).concat(printer.TEXT(sRow.filter(col => col).join("\t")));
                        })
                    }
                });
                printCmd = printCmd.concat(printer.LF(1),printer.HL());
                this.$emit('print',printCmd);
            });
        }
    }
</script>
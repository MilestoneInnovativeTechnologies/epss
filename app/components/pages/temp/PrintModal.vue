<template>
    <Page>
        <AlignMiddle>
            <ActivityIndicator :busy="true" verticalAlignment="center" horizontalAlignment="center"></ActivityIndicator>
            <TextTitle class="w-full text-center">Printing in progress!!</TextTitle>
        </AlignMiddle>
    </Page>
</template>

<script>
    import { mapState } from 'vuex';

    /*
    * TEMPLATE
    * [
    *   { type:'raw',source:'key of data',keys:[keys to fetch] },
    *   { type: 'line' }
    *   { type: 'feed', amount:2 },
    *   { type: 'table',source:'key to array in data',heads:[heads],keys:[keys] }
    * ]
    * */

    export default {
        name: "PrintModal",
        props: ['data','title','template'],
        data(){ return {
            lineMaxLength: 16,
            printHead: [],
            printFoot: [],
            printTitle: [],
            commands: [],
            lines: [],
            lineExtra: [],
        } },
        computed: {
            ...mapState('App',['image','print_head_line1','print_head_line2','footer_text'])
        },
        methods: {
            addCommand(data){ this.commands.push(data); },
            getPrintHead(){
                let printCmd = [];
                if(this.print_head_line1) printCmd = printCmd.concat(printer.CENTERON(),printer.TEXT(this.print_head_line1));
                if(this.print_head_line2) printCmd = printCmd.concat(printer.LF(),printer.CENTERON(),printer.TEXT(this.print_head_line2));
                return printCmd;
            },
            getPrintFooter(){
                let printCmd = [];
                if(this.footer_text) printCmd = printCmd.concat(printer.CENTERON(),printer.TEXT(this.footer_text));
                return printCmd;
            },
            getLineSeparator(bold){
                return [].concat(printer.LF(),printer.CENTERON(),bold ? printer.BOLDON() : [],printer.HL(),printer.BOLDOFF(),printer.LF())
            },
            populateFromPrintTemplate(){
                _.forEach(this.template,(template) => this.populatePrintArray(template))
            },
            populatePrintArray({ type,source,keys,amount,heads }){
                let command;
                if(type === 'raw') command = this.populatePrintRaw(this.data[source],keys);
                if(type === 'line') command = this.getLineSeparator();
                if(type === 'feed') command = printer.LF(amount || 1);
                if(type === 'table') command = this.populatePrintTable(heads,keys,this.data[source]);
                this.addCommand(command);
            },
            populatePrintRaw(obj,keys){
                return _.map(keys,(display,key) => this.populatePrintRawItem(display,_.get(obj,key))).concat(printer.LF(1))
            },
            populatePrintRawItem(title,value){
                if(!title) return []; value = value || '-';
                return []
                    .concat(printer.LF())
                    .concat(printer.LEFTON())
                    .concat(printer.TEXT(title.toString().toUpperCase()))
                    .concat(printer.TEXT(': '))
                    .concat(printer.BOLDON())
                    .concat(printer.TEXT(value.toString().toUpperCase()))
                    .concat(printer.BOLDOFF())
                ;

            },
            populatePrintTable(heads,keys,dArray){
                this.populateTableLines(dArray,keys);
                let tHead = [].concat(this.getPrintTableHeads(heads),printer.LF(),printer.HL());
                let tContent = [].concat(this.getTableLinesContent());
                let tFoot = [].concat(printer.LF(),printer.HL(),printer.LF());
                return _.flattenDeep([].concat(tHead,tContent,tFoot));
            },
            getPrintTableHeads(heads){
                return [].concat(printer.TEXT(heads.join("\t")))
            },
            populateTableLines(dArray,keys){
                let vm = this;
                _.forEach(dArray,(item,row) => {
                    _.forEach(keys,(key,col) => {
                        vm.addToPrintLine(row,col,item[key]);
                    })
                });
            },
            addToPrintLine(row,col,content){
                content = content || '-';
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
            getTableLinesContent(){
                let cmd = [], vm = this;
                _.forEach(this.lines,(colArray,row) => {
                    cmd = cmd.concat(printer.LF(1)).concat(printer.TEXT(colArray.filter(col => col).join("\t")));
                    if(this.lineExtra[row]){
                        let extra = _.filter(vm.lineExtra[row]);
                        _.forEach(extra,(sRow) => {
                            cmd = cmd.concat(printer.LF(1)).concat(printer.TEXT(sRow.filter(col => col).join("\t")));
                        })
                    }
                    cmd.concat(printer.LF(1))
                });
                return cmd;
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
        created(){
            this.printHead = this.getPrintHead();
            this.printTitle = [].concat(printer.LF(2),printer.CENTERON(),printer.BOLDON(),printer.TEXT(this.title),printer.BOLDOFF());
            this.printFoot = this.getPrintFooter();
            this.populateFromPrintTemplate();
        },
        mounted(){
            let print_data = _.concat(this.printHead,this.printTitle,this.getLineSeparator(true),this.commands,this.getLineSeparator(true),this.printFoot);
            print_data = _.flattenDeep(print_data);
            print(print_data); this.$modal.close(print_data);
        }
    }
</script>
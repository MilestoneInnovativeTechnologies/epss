import {ThisObj} from "./tobj";

let FNPrint = null;
export const FnPrint = {
    mixins: [ThisObj],
    methods: {
        FnPrint(Obj,lookup){
            Obj = (Obj === undefined) ? this.TO_Get(this.FnPrintProps,lookup) : Obj;
            return new Promise(resolve => FNPrint.props(Obj).prepare().then(FNPrint => resolve(FNPrint.print(this.FnPrintPrintWidth))))
        }
    },
    computed: {
        FnPrintProps(){ return FNPrint.props() },
        FnPrintPrintWidth(){ return this.$store.getters["App/get"]('print_width'); }
    },
    mounted(){
        FNPrint = new Print(this.print || this.printFncode || this.fncode);
    }
};

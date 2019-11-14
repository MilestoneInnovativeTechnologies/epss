import {WideScreenCheck} from "./widescreencheck";

let FNPrint = null;
export const FnPrint = {
    mixins: [WideScreenCheck],
    methods: {
        FnPrint(Obj){
            return new Promise(resolve => FNPrint.props(Obj).prepare().then(FNPrint => resolve(FNPrint.print(this.WSC_isWide ? 48 : 32))))
        }
    },
    computed: {
        FnPrintProps(){ return FNPrint.props() }
    },
    mounted(){
        FNPrint = new Print(this.fncode);
    }
};
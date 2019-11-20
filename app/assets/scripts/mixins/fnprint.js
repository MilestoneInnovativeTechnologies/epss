import {WideScreenCheck} from "./widescreencheck";
import {ThisObj} from "./tobj";

let FNPrint = null;
export const FnPrint = {
    mixins: [WideScreenCheck,ThisObj],
    methods: {
        FnPrint(Obj){
            Obj = (Obj === undefined) ? this.TO_Get(this.FnPrintProps) : Obj;
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
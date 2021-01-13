import { mapState,mapActions } from "vuex";
import {fetch_fiscal_year_details} from "../../queries";

export const FormElementMixinFiscal = {
    computed: {
        ...mapState('Fiscal',{ feFiscalList:(state) => state['dbData']['fiscalyearmaster'] }),
        feValuesFiscal(){
            let list = this.feFiscalList, key = 'code', label = 'name', listArray = _.map(list,(fiscal) => _.zipObject([key,label],[fiscal[key],fiscal[label]]));
            return { items:listArray, key, label };
        },
        feFieldFiscal(){ return { name:'fycode',label:'Select Fiscal Year',type:'Picker',values:this.feValuesFiscal,hidden:this.feValuesFiscal.items.length === 1 } }
    },
    methods: {
        ...mapActions({ feListFetchFiscal: 'Fiscal/_stockIfNot' }),
    },
    created() {
        this.feListFetchFiscal({ query:sql.format(fetch_fiscal_year_details),key:'list' })
    }
};
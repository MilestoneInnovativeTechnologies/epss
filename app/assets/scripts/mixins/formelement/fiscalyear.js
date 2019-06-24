import { mapState,mapActions } from "vuex";
import {fetch_fiscal_year_details} from "../../queries";

export const FormElementMixinFiscalyear = {
    computed: {
        ...mapState('Fiscal',{ feFiscalList:'list' }),
        feFiscalValues(){
            let list = this.feFiscalList, key = 'id', label = 'name', listArray = _.map(list,(customer) => _.zipObject([key,label],[customer.id,customer.name]));
            return _.map(list,'name'); //return { items:listArray, key, label };
        },
        feFieldFiscal(){ return { name:'fiscalyear',label:'Select Fiscal Year',type:'Picker',values:this.feFiscalValues,hidden:this.feFiscalValues.length === 1 } }
    },
    methods: {
        ...mapActions({ feFiscalProvider: 'Fiscal/_stockIfNot' }),
    },
    created() {
        this.feFiscalProvider({ query:sql.format(fetch_fiscal_year_details),key:'list' })
    }
};
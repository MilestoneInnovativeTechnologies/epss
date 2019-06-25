import { mapState,mapActions } from "vuex";
import {fetch_fiscal_year_details} from "../../queries";

export const FormElementMixinFiscalyear = {
    computed: {
        ...mapState('Fiscal',{ feFiscalList:'list' }),
        feValuesFiscal(){
            let list = this.feFiscalList, key = 'id', label = 'name', listArray = _.map(list,(customer) => _.zipObject([key,label],[customer.id,customer.name]));
            return _.map(list,(item) => [item.id,item.name,].join(': ')); //return { items:listArray, key, label };
        },
        feFieldFiscal(){ return { name:'fiscal',label:'Select Fiscal Year',type:'Picker',values:this.feValuesFiscal,hidden:this.feValuesFiscal.length === 1 } }
    },
    methods: {
        ...mapActions({ feListFetchFiscal: 'Fiscal/_stockIfNot' }),
    },
    created() {
        this.feListFetchFiscal({ query:sql.format(fetch_fiscal_year_details),key:'list' })
    }
};
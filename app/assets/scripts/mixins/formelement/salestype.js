import { mapGetters } from "vuex";

export const FormElementMixinSalesType = {
    computed: {
        ...mapGetters('Settings',{ feSalesTypeListSettings:'setting' }),
        feValuesSalesType(){
            let FNb2b = this.feSalesTypeListSettings('SALESB2BFNCODE');
            let FNb2c = this.feSalesTypeListSettings('SALESB2CFNCODE');
            return _.zipObject([FNb2c,FNb2b],['B2C','B2B']);
        },
        feFieldSalesType(){ return { name:'type',label:'Select Sale Type',type:'Picker',values:this.feValuesSalesType } }
    },
};
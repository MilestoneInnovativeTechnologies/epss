import { mapState,mapActions } from "vuex";
import {fetch_all_transaction_natures} from "../../queries";

export const FormElementMixinNature = {
    computed: {
        ...mapState('TRNS',{ feNatureList:'list' }),
        feValuesNature(){
            let list = this.feNatureList, key = 'id', label = 'name', listArray = _.map(list,(nature) => _.zipObject([key,label],[nature.id,nature.name]));
            return _.map(list,(item) => [item.id,item.name,].join(': ')); //return { items:listArray, key, label };
        },
        feFieldNature(){ return { name:'nature',label:'Select Nature',type:'Picker',values:this.feValuesNature } }
    },
    methods: {
        ...mapActions({ feListFetchNature: 'TRNS/_stockIfNot' }),
    },
    created() {
        this.feListFetchNature({ query:sql.format(fetch_all_transaction_natures),key:'list' })
    }
};
import { mapState } from "vuex";

export const FormElementMixinReturnSaleProduct = {
    computed: {
        ...mapState('Transaction',{ feSLReturnSaleProduct:'detail' }),
        feFieldReturnSaleProduct(){ return { name:'product',label:'Select Product',type:'Picker',values:this.feValuesReturnSaleProduct() } }
    },
    methods: {
        feValuesReturnSaleProduct(){
            let key = 'pid', label = 'product', listArray = _.map(this.feSLReturnSaleProduct[this.sales],(sale) => _.pick(sale,[key,label]));
            return { items:listArray, key, label };
        }
    }
};
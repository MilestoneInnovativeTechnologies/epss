import { mapState,mapActions } from "vuex";
import {fetch_all_products} from "../../queries";

export const FormElementMixinProduct = {
    computed: {
        ...mapState('Product',{ feProductList:'list' }),
        feValuesProduct(){
            let list = this.feProductList, key = 'id', label = 'name', listArray = _.map(list,(product) => _.zipObject([key,label],[product.id,product.name]));
            return _.map(list,(item) => [item.id,item.name,].join(': ')); //return { items:listArray, key, label };
        },
        feFieldProduct(){ return { name:'product',label:'Select Product',type:'Picker',values:this.feValuesProduct } }
    },
    methods: {
        ...mapActions({ feListFetchProduct: 'Product/_stockIfNot' }),
    },
    created() {
        this.feListFetchProduct({ query:sql.format(fetch_all_products),key:'list' })
    }
};
import { mapActions } from "vuex";
import {autocomplete_minimum_items} from "../../constants";

export const FormElementMixinProduct = {
    computed: {
        feValuesProduct(){
            let list = CCache['products'].all(), key = 'id', label = 'narration', listArray = _.map(list,(product) => _.zipObject([key,label],[product[key],product[label]]));
            return { items:listArray, key, label };
        },
        feFieldProduct(){ return {
            name:'product',label:'Select Product',
            type: (this.feValuesProduct.items.length > autocomplete_minimum_items) ? 'AutoCompleteInline' : 'Picker',
            values:this.feValuesProduct
        } }
    },
    methods: mapActions(['redrawModules']),
    created(){
        if(!CCache['products']) this.redrawModules('products');
    }
};
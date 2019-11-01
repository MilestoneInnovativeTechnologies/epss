import { mapActions } from "vuex";

export const FormElementMixinProduct = {
    computed: {
        feValuesProduct(){
            let list = CCache['products'].all(), key = 'id', label = 'narration', listArray = _.map(list,(product) => _.zipObject([key,label],[product[key],product[label]]));
            return { items:listArray, key, label };
        },
        feFieldProduct(){ return { name:'product',label:'Select Product',type:'Picker',values:this.feValuesProduct } }
    },
    methods: mapActions(['redrawModules']),
    created(){
        if(!CCache['products']) this.redrawModules('products');
    }
};
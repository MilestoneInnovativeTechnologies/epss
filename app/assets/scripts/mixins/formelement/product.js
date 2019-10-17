import { mapState,mapActions } from "vuex";

export const FormElementMixinProduct = {
    computed: {
        ...mapState('Product',{ feProductList:'dbData' }),
        feValuesProduct(){
            let list = this.feProductList['products'], key = 'id', label = 'narration', listArray = _.map(list,(product) => _.zipObject([key,label],[product[key],product[label]]));
            return { items:listArray, key, label };
        },
        feFieldProduct(){ return { name:'product',label:'Select Product',type:'Picker',values:this.feValuesProduct } }
    },
    methods: mapActions(['redrawModules']),
    created(){
        if(this.feProductList['products'].length === 0) this.redrawModules('products');
    }
};
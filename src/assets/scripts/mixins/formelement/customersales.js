import { mapActions,mapState } from "vuex";

export const FormElementMixinCustomerSales = {
    computed: {
        ...mapState('Sales',['customerSaleSummary']),
        feFieldCustomerSales(){ return { name:'sales',label:'Select Sales',type:'Picker',values:this.feValuesCustomerSales() } }
    },
    methods: {
        ...mapActions('Sales',['_stock']),
        feValuesCustomerSales(){
            let list = _.uniqBy(this.customerSaleSummary[this.customer],'id'), key = 'id', label = 'docno',
                listArray = _.map(list,(sale) => _.zipObject([key,label],[sale[key],sale[label]+' - '+__.docdate(sale.date)]));
            return { items:listArray, key, label };
        }
    }
};
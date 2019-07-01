import { mapActions,mapState } from "vuex";
import {TransactionQueryBuilder} from "../../services/transactionquery";

export const FormElementMixinCustomerSales = {
    computed: {
        ...mapState('Sales',['customerSaleSummary']),
        feFieldCustomerSales(){ return { name:'sales',label:'Select Sales',type:'Picker',values:this.feValuesCustomerSales() } }
    },
    methods: {
        ...mapActions('Sales',['_stock']),
        feValuesCustomerSales(){
            let list = this.customerSaleSummary[this.customer], key = 'id', label = 'docno',
                listArray = _.map(list,(sale) => _.zipObject([key,label],[sale[key],sale[label]]));
            return { items:listArray, key, label };
        }
    },
    created() {
        let query = new TransactionQueryBuilder('SL').fields(['id','docno','date','total','cid']).where({ cid:this.customer }).max(15).query();
        this._stock({ query,key:'customerSaleSummary',path:this.customer })
    }
};
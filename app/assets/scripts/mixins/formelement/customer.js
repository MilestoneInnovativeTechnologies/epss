import { mapState,mapActions } from "vuex";
import {user_assigned_area_customers} from "../../queries";

export const FormElementMixinCustomer = {
    computed: {
        ...mapState('User',{ feUserID:'id' }), ...mapState('Customer',{ feCustomerList:'list' }),
        feCustomerProviderQuery(){ return sql.format(user_assigned_area_customers,this.feUserID) },
        feCustomerValues(){
            let list = this.feCustomerList, key = 'id', label = 'name', listArray = _.map(list,(customer) => _.zipObject([key,label],[customer.id,customer.name]));
            return _.map(list,'name'); //return { items:listArray, key, label };
        },
        feFieldCustomer(){ return { name:'customer',label:'Select a customer',type:'Picker',values:this.feCustomerValues } }
    },
    methods: {
        ...mapActions({ feCustomerProvider: 'Customer/_stockIfNot' }),
    },
    created() {
        this.feCustomerProvider({ query:this.feCustomerProviderQuery,key:'list' })
    }
};
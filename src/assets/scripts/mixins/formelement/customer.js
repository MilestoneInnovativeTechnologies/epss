import { mapState,mapActions } from "vuex";
import {login_user_area_customers} from "../../queries";
import {autocomplete_minimum_items} from "../../constants";

export const FormElementMixinCustomer = {
    computed: {
        ...mapState('User',{ feUserID:'id' }), ...mapState('Customer',{ feCustomerList:'list' }),
        feValuesCustomer(){
            let list = this.feCustomerList, key = 'id', label = 'name', listArray = _.map(list,(customer) => _.zipObject([key,label],[customer.id,customer.name]));
            return { items:listArray, key, label };
        },
        feFieldCustomer(){ return {
            name:'customer',label:'Select a customer',
            type: (this.feValuesCustomer.items.length > autocomplete_minimum_items) ? 'AutoCompleteInline' : 'Picker',
            values:this.feValuesCustomer
        } }
    },
    methods: {
        ...mapActions({ feListFetchCustomer: 'Customer/_stockIfNot' }),
    },
    created() {
        if(this.feCustomerList.length === 0) this.feListFetchCustomer({ query:sql.format(login_user_area_customers,this.feUserID),key:'list' });
    }
};
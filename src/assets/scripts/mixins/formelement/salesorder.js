import { mapState,mapActions } from "vuex";
import {user_assigned_customer_sales_orders} from "../../queries";

export const FormElementMixinSalesOrder = {
    computed: {
        ...mapState('User',{ feUserID:'id' }), ...mapState('SalesOrder',{ feListSalesOrder:'list' }),
        feValuesSalesOrder(){
            let list = this.feListSalesOrder, key = '_ref', label = 'docno', listArray = _.map(list,(so) => _.zipObject([key,label],[so[key],so[label]]));
            listArray = this.defaultItemEmpty(listArray,key,label); return { items:listArray, key, label };
        },
        feFieldSalesOrder(){ return { name:'salesorder',label:'Select Sales Order(if any)',type:'Picker',values:this.feValuesSalesOrder } }
    },
    methods: {
        ...mapActions({ feListFetchSalesOrder: 'SalesOrder/_stockIfNot' }),
    },
    created() {
        this.feListFetchSalesOrder({ query:sql.format(user_assigned_customer_sales_orders,this.feUserID),key:'list' })
    }
};
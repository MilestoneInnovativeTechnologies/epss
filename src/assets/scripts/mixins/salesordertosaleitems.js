import { mapGetters } from 'vuex';

export const SalesOrderToSaleItems = {
    data(){ return {
        SOSIFNCode: null,
    } },
    computed:{
        ...mapGetters({ SOSIGetSalesOrderItems:'SalesOrder/salesOrderItems',SOSIReferences:'_ref',SOSIGetProduct:'Product/product',SOSITax:'Product/tax' }),
    },
    methods: {
        SOSI(id){
            let SOI = this.SOSIGetSalesOrderItems(id), _refs = this.SOSIReferences(SOI.length), SOSIItems = []; if(SOI.length < 2) _refs = [_refs];
            SOSIItems = _.map(SOI,(soi,idx) => {
                let product = this.SOSIGetProduct(soi.product), tax = this.SOSITax(soi.product,this.SOSIFNCode);
                return Object.assign({},product,{ _ref:_refs[idx] },_.pick(soi,['quantity','rate','taxrule','tax','total']),{ taxfactor:tax[1] });
            });
            return SOSIItems;
        }
    },
    created(){
        EB.$on('sale-fncode',(fncode) => this.SOSIFNCode = fncode)
    }
};
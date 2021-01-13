export const FormElementMixinDiscountType = {
    computed: {
        feValuesDiscountType(){
            return 'Amount,Percentage';
        },
        feFieldDiscountType(){ return { name:'type',label:'Discount Type',type:'Picker',values:this.feValuesDiscountType } }
    },
};
export const FormElementMixinPaymentMode = {
    computed: {
        feFieldPaymentMode(){ return { name:'mode',label:'Payment Mode',type:'Picker',values:'Cash,Cheque' } }
    },
};
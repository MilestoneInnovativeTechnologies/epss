export const FormElementMixinPayment = {
    computed: {
        feFieldPayment(){ return { name:'payment',label:'Select Payment Mode',type:'Picker',values:'Cash,Credit' } }
    },
};
<template>
    <App title="Stock Unload" action="Proceed" @proceed="proceed">
        <TextTitle>Stock Transfer OUT</TextTitle>
        <AppForm :fields="fields()" @final="setFinals"></AppForm>
    </App>
</template>

<script>
    const feMX = require('./../../../assets/scripts/mixins/formelement');

    export default {
        name: "StockUnloadIndex",
        mixins: [feMX.common, feMX.store, feMX.fiscal],
        data(){ return {
            fieldLayout: { store:'Store',fycode:'Fiscal' },
            store: null, fycode:null
        }},
        methods: {
            setFinals(data){
                _.forEach(data,(value,name) => this[name] = value);
            },
            fields(){
                let fields = this.appFormFields();
                fields.store.label = 'Select source store to transfer stock';
                return fields;
            },
            proceed(){
                if(!this.store) return alert('Please choose a store to proceed..');
                this.$navigateTo(require('./StockUnloadItems').default,{ props:{ store:this.store,fycode:this.fycode }})
            }
        },
        mounted() {
            if(this.feFieldStore.values.items.length === 1 && this.feFieldFiscal.values.items.length === 1 ) this.proceed()
        }
    }
</script>
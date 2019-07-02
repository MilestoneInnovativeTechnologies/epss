<template>
    <App title="New Sales Return" action="Select Products" @select-products="selectProducts">
        <AppForm :fields="appFormFields()" :values="values" @final="setFinal"></AppForm>
    </App>
</template>

<script>
    import { mapGetters } from "vuex";
    const feMX = require("../../../assets/scripts/mixins/formelement");

    export default {
        name: "ReturnNewForm",
        mixins: [feMX.common,feMX.customersales,feMX.store,feMX.fiscal,feMX.datepicker,feMX.payment],
        props: ['id'],
        data(){ return {
            fieldLayout: { sales:'CustomerSales',store:'Store',fiscal:'Fiscal',date:'DatePicker',payment_type:'Payment' },
            final: {},
        }},
        computed: {
            ...mapGetters({ date:'date',user:'user',_ref:'_ref',docno:'Sales/docno',setting:'Settings/setting',stores:'User/stores',doc:'Sales/docno',fiscal:'Fiscal/_tableDataItem' }),
            customer(){ return this.id }, values(){ return { date:this.date() } },
            fncode(){ return this.setting('SALESRETURNFNCODE') }, store(){ return this.stores[0] },
            docno(){ return this.doc(this.store,this.final.fiscal,this.fncode) },
            fycode(){ return _.get(this.fiscal('fiscalyearmaster',this.final.fiscal),'code');}
        },
        methods: {
            setFinal(data){ this.final = Object.assign({},this.final,data) },
            selectProducts(){
                let master = { user:this.user,docno:this.docno,date:this.final.date,customer:this.id,fycode:this.fycode,fncode:this.fncode,payment_type:this.final.payment_type,_ref:this._ref() };
                let sales = this.final.sales, store = this.final.store, transaction = master._ref;
                this.$navigateTo(require('./ReturnNewItems').default,{ props: { master,sales,store,transaction },backstackVisible:false })
            },
        }
    }
</script>
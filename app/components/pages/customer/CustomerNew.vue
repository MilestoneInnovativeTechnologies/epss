<template>
    <App title="Add New Customer" action="Save" @save="save">
        <AppForm :fields="appFields" @final="setValues"></AppForm>
    </App>
</template>

<script>
    import { mapActions } from 'vuex';
    const feMX = require('./../../../assets/scripts/mixins/formelement');

    export default {
        name: "CustomerNew",
        mixins: [feMX.common, feMX.area, feMX.text, feMX.email, feMX.textarea],
        data(){ return {
            fields: { name:'Text',area:'Area',phone:'Text',email:'Email',address:'Textarea' },
            values: { name:'',phone:'',address:'',area:'',email:'' },
        }},
        computed: {
            appFields(){ let fields = this.appFormFields(this.fields); return _.mapValues(fields,(field,name) => { field.label = _.startCase(name); return field; }) },
        },
        methods: {
            ...mapActions('Users',['addNew']),
            setValues(data){ this.values = Object.assign({},this.values,data); },
            save(){ this.addNew(this.values).then((id) => alert('Saved new customer').then(() => this.$navigateTo(require('./CustomerDetail').default,{ props:{ id }}))) },
        }
    }
</script>
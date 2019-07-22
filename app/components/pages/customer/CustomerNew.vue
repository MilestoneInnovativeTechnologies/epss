<template>
    <App title="Add New Customer" action="Save" @save="save">
        <AppForm :fields="appFields" :values="values" @final="setValues"></AppForm>
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
            values: { name:'',phone:'',address:'',area:'',email:'' }, id: ''
        }},
        computed: {
            appFields(){ let fields = this.appFormFields(this.fields); return _.mapValues(fields,(field,name) => { field.label = _.startCase(name); return field; }) },
        },
        methods: {
            ...mapActions(['_insert']),
            setValues(data){ this.values = Object.assign({},this.values,data); },
            save(){ this._insert({ table:'users',data:_.omit(this.values,'area'),success:this.addArea,vm:this }) },
            addArea(id){ this._insert({ table:'area_users',data:{ user:this.id = id, area:this.values.area },success:this.saved,vm:this }); },
            saved(){ alert('New customer saved').then(() => this.$navigateTo(require('./CustomerDetail').default,{ props:{ id:this.id }})); }
        }
    }
</script>
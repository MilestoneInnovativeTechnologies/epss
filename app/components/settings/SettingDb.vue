<template>
    <StackLayout>
        <TextNormal v-if="text" textWrap="true" :text="text" class="cp m-l-15"></TextNormal>
        <AppForm :fields="fields" :values="values" @final="saveFinal"></AppForm>
    </StackLayout>
</template>

<script>
    import {SettingsCommonMixin} from "../../assets/scripts/mixins/settingscommon";
    const fieldName = 'SettingValue';

    export default {
        name: "SettingDb",
        mixins: [SettingsCommonMixin],
        props: ['table','field','row','text','editor','options','switch'],
        data(){ return {
            values: {},
            initialized: false,
        } },
        computed: {
            condition(){ return typeof this.row === 'object' ? this.row : { id:this.row } },
        },
        methods: {
            setValue(value){ this.$set(this.values,fieldName,value) },
            saveFinal(obj){
                if(!this.initialized) return this.initialized = true;
                let data = _.zipObject([this.field],[obj[fieldName]]);
                DBUpdate(this,data);
            },
        },
        created(){
            DB.get(this.table,this.condition,function(vm){
                if(this.result) vm.setValue(this.result[0][vm.field])
            },this)
        }
    }
    const DBUpdate = _.debounce(function({ table,condition,$store:{ dispatch } },data){
        dispatch('_update',{ table,data,condition },{ root:true });
    },2000,{ trailing:true,leading:false })
</script>
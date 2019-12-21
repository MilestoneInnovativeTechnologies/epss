<template>
    <StackLayout style="border-left-width: 2; border-color: #EF6D3B;" class="m-y-2">
        <TextNormal v-if="display || text" textWrap="true" :text="display || text" class="cp m-l-15" />
        <AppForm :fields="fields" :values="values" @final="saveFinal" />
    </StackLayout>
</template>

<script>
    import {SettingsCommonMixin} from "../../assets/scripts/mixins/settingscommon";
    const fieldName = 'SettingValue';

    export default {
        name: "SettingDb",
        mixins: [SettingsCommonMixin],
        props: ['table','field','row','text','editor','options','switch','default'],
        data(){ return {
            values: {}, display: false,
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
                if(!this.error && this.result && this.result.length) vm.setValue(this.result[0][vm.field]);
                else {
                    if(vm.default && vm.default.trim() !== ''){
                        if(vm.default.substr(0,1) === '[' && vm.default.substr(-1) === ']'){
                            let parts = vm.default.substring(1,vm.default.length-1).split(',');
                            DB.get(parts[0],{ id:parts[2] },function(field,vm){
                                if(this.result) vm.setValue(this.result[0][field]);
                            },parts[1],vm)
                        } else vm.setValue(vm.default);
                    }
                }
            },this);

            if(this.text && this.text.trim() && this.text.substr(0,1) === '[' && this.text.substr(-1) === ']'){
                let parts = this.text.substring(1,this.text.length-1).split(',');
                DB.get(parts[0],{ id:parts[2] },function(field,vm){
                    if(this.result) vm.display = this.result[0][field];
                },parts[1],this)
            }
        }
    }
    const DBUpdate = _.debounce(function({ table,condition,$store:{ dispatch } },data){
        dispatch('_update',{ table,data,condition },{ root:true });
    },2000,{ trailing:true,leading:false })
</script>
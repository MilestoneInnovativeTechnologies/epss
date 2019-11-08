<template>
    <AppForm :fields="{ filter:{ type:'Text', label:'Search' } }" @filter="setFilterText"></AppForm>
</template>

<script>
    export default {
        name: "TRAItemsFilter",
        methods: {
            setFilterText(text){
                emitText(this,text)
            }
        }
    }
    function emitText(vm,text){ _.debounce((vm,text) => vm.$emit('filter',text),1500,{ leading:true })(vm,text) }
</script>
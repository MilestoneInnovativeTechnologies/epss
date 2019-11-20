<template>
    <AppForm :fields="{ filter:{ type:'Text', label:'Search' } }" @filter="setFilterText"></AppForm>
</template>

<script>
    const emitText = _.debounce((vm,text) => vm.$emit('filter',text),1500,{ leading:true });

    export default {
        name: "TRAItemsFilter",
        methods: {
            setFilterText(text){
                emitText(this,text)
            }
        }
    }
</script>
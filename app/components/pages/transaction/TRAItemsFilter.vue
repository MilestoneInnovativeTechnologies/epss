<template>
    <AppForm :fields="{ filter:{ type:'Text', label:'Search' } }" @filter="setFilterText"></AppForm>
</template>

<script>
    let timeOut = 0;

    export default {
        name: "TRAItemsFilter",
        methods: {
            setFilterText(text){
                clearTimeout(timeOut);
                timeOut = setTimeout(() => this.$emit('filter',text),1500);
            }
        }
    }
</script>
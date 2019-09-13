<template>
    <AppForm :fields="{ filter:{ type:'Text', label:'Search' } }" @filter="setFilterText"></AppForm>
</template>

<script>
    export default {
        name: "WSSaleItemsFilter",
        methods: {
            setFilterText(text){ this.$emit('filter',text); }
        }
    }
</script>
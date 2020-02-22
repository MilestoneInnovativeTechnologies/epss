<template>
    <TextField ref="txtFld" hint="Search" v-model="filter" class="m-y-10" />
</template>

<script>
    const emitText = _.debounce((vm,text) => vm.$emit('filter',text),1500,{ leading:true });

    export default {
        name: "TRAItemsFilter",
        computed: {
            filter: {
                get(){ return '' },
                set(value){ emitText(this,value) }
            }
        },
        mounted(){ setTimeout(() => this.$refs['txtFld'].nativeView.focus(),1000); }
    }
</script>
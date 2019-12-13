<template>
    <App title="Customers">
        <CustomerList v-if="CCacheDataReady" :customers="customers"></CustomerList>
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../assets/scripts/mixins/ccachedata";

    export default {
        name: "CustomersIndex",
        mixins: [CCacheDataMixin],
        created(){ this.CCacheDataPrepare({ table:'users',key:'customers' }); }
    }
</script>
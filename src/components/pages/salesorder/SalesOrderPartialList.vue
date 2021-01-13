<template>
    <App title="Partial Sales Orders">
        <SalesOrderList title="Partially Completed Sales Orders" v-if="CCacheDataReady && transactions" :transactions="transactions" />
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../../assets/scripts/mixins/ccachedata";

    export default {
        name: "SalesOrderPartialList",
        mixins: [CCacheDataMixin],
        computed: {
            transactions(){ return (this.sales_order && _.values(this.sales_order).length) ? _.values(this.sales_order).filter(({ progress }) => progress === 'Partial') : null }
        },
        created(){ this.CCacheDataPrepare({ table:'sales_order',method:'dataById' }) }
    }
</script>
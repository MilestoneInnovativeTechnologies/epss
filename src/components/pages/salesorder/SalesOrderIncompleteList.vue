<template>
    <App title="Incomplete Sales Orders">
        <SalesOrderList title="In Complete Sales Orders" v-if="CCacheDataReady && transactions" :transactions="transactions" />
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../../assets/scripts/mixins/ccachedata";

    export default {
        name: "SalesOrderIncompleteList",
        mixins: [CCacheDataMixin],
        computed: {
            transactions(){ return (this.sales_order && _.values(this.sales_order).length) ? _.values(this.sales_order).filter(({ progress }) => progress === 'Incomplete') : null }
        },
        created(){ this.CCacheDataPrepare({ table:'sales_order',method:'dataById' }) }
    }
</script>
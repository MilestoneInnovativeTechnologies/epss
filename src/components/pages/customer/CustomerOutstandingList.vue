<template>
    <App title="Outstanding List">
        <CustomerList class="m-t-15" v-if="CCacheDataReady" :customers="customers" :layout="layout" title="Outstanding List" />
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../../assets/scripts/mixins/ccachedata";
    const layout = { Customer:'name',Outstanding:'outstanding' };

    export default {
        name: "CustomerOutstandingList",
        data(){ return { layout } },
        mixins: [CCacheDataMixin],
        computed: {
            customers(){ return this.users.filter(({ outstanding }) => _.toNumber(outstanding)>0) }
        },
        created() { this.CCacheDataPrepare('users'); }
    }
</script>
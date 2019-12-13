<template>
    <App title="Overdue List">
        <CustomerList class="m-t-15" v-if="CCacheDataReady" :customers="customers" :layout="layout" title="Overdue List" />
    </App>
</template>

<script>
    import {CCacheDataMixin} from "../../../assets/scripts/mixins/ccachedata";
    const layout = { Customer:'name',Overdue:'overdue' };

    export default {
        name: "CustomerOverdueList",
        data(){ return { layout } },
        mixins: [CCacheDataMixin],
        computed: {
            customers(){ return this.users.filter(({ overdue }) => _.toNumber(overdue)>0) }
        },
        created() { this.CCacheDataPrepare('users'); }
    }
</script>
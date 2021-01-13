<template>
    <App title="Function Reserves" action="Home" @home="goHome">
        <AppList v-if="records.length > 0" :source="source" :layout="{ FN:'fncode',Start:'start_num',Current:'current',Progress:'progress' }" :maxHeadContents="4" :limit="records.length" />
        <TextBold v-else text="No reserves found" />
    </App>
</template>

<script>
    import {Home} from "../../assets/scripts/navigations";

    export default {
        name: "ReservesIndex",
        props: ['store'],
        data(){ return { records:[] } },
        computed: {
            source(){ return this.records.map(record => _.pick(record,['fncode','start_num','current','progress'])) },
        },
        methods: {
            goHome(){ return this.$navigateTo(Home.default) }
        },
        created(){
            DB.get('fn_reserves',{ store:this.store }).then(records => this.records = records);
        }
    }
</script>
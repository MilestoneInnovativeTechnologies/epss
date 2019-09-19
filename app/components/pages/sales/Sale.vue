<template>
    <WSSaleNew v-if="isWide"></WSSaleNew>
    <SaleNew v-else></SaleNew>
</template>

<script>
    import { mapState } from 'vuex';
    import SaleNew from "./SaleNew";
    export default {
        name: "Sale",
        components: {SaleNew},
        data(){ return {
            wideMinWidth: 900,
        } },
        computed: {
            ...mapState('App',['width']),
            isWide(){ let width = this.width; return (this.wideMinWidth < _.toNumber(width)) }
        }
    }
</script>
<template>
    <App title="New Sales Return" action="Proceed" @proceed="proceed">
        <AppList title="Select Customer" :layout="tblLayout" :cast="tblCast" :source="count" action="pick" @collection="picked"></AppList>
    </App>
</template>

<script>
    import { mapActions,mapState } from 'vuex';
    import {customer_recent_sales_count_for_return} from "../../../assets/scripts/queries";
    export default {
        name: "ReturnNew",
        data(){ return {
            tblLayout: { Customer:'customer', 'Total Sales':'salesCount', 'Last Sale Date':'lastSaleDate' },
            tblCast: { lastSaleDate:'docdate' },
            cid: null,
        }},
        computed: {
            ...mapState('Sales',['count','customerSaleSummary']),
        },
        methods: {
            ...mapActions('Sales',['_stock']),
            picked(items){ this.cid = (items && items[0]) ? items[0]['cid'] : undefined },
            proceed(){
                if(!this.cid) return alert('Please select a customer to proceed..');
                this.$navigateTo(require('./ReturnNewForm').default,{ props:{ id:this.cid },backstackVisible:false })
            }
        },
        created() {
            this._stock({ query:sql.format(customer_recent_sales_count_for_return),key:'count' })
        }
    }
</script>
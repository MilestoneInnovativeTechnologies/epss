<template>
    <App :title="title" action="Add New" @add-new="createNew">
        <SalesOrderList :transactions="transactions" :limit="10" :title="'Recent ' + title" class="m-t-15"></SalesOrderList>
    </App>
</template>

<script>
    import { mapState,mapActions } from 'vuex';
    import {fetch_recent_sales_order} from "../../assets/scripts/queries";
    import {WideScreenCheck} from "../../assets/scripts/mixins/widescreencheck";
    import {ThisObj} from "../../assets/scripts/mixins/tobj";
    import {NewSalesOrder, NewSalesOrderAdvanced} from "../../assets/scripts/navigations";

    const constants = { limit: 30, after: 3, on: 3 };

    export default {
        name: "SalesOrderIndex",
        mixins: [ThisObj,WideScreenCheck],
        props: ['fycode','fncode','store'],
        data(){ return {
        } },
        computed: {
            ...mapState('SalesOrder',['recent']), ...mapState('Menu',['content']),
            transactions(){ return this.recent[this.fncode] },
            title(){ return _.get(_.filter(this.content,(itm) => itm.fncode === this.fncode),'0.name') }
        },
        methods: {
            ...mapActions('SalesOrder',{ stockSalesOrder:'_stockIfNot' }),
            doStock(){
                let query = sql.format(fetch_recent_sales_order,[this.store,this.fycode,this.fncode,constants.limit]);
                this.stockSalesOrder({ query:query,key:'recent',path:this.fncode,on:constants.on });
            },
            createNew(){
                let navComponent = this.WSC_isWide ? NewSalesOrderAdvanced : NewSalesOrder;
                this.$navigateTo(navComponent,{ props:this.TO_Get(['store','fycode','fncode','title']) });
            }
        },
        created() {
            if(!this.recent[this.fncode] || _.isEmpty(this.recent[this.fncode])) this.doStock();
            else setTimeout(() => this.doStock(),constants.after * 1000);
        }

    }
</script>
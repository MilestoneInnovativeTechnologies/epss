<template>
    <App :title="title" scroll="false" :width="properties.container">
        <GridLayout rows="*" :columns="[properties.leftPortion,'*'].join(',')">
            <TRALeftPortion row="0" col="0" :fncode="fncode" :layout="layout()" @save="saveTransaction"></TRALeftPortion>
            <TRARightPortion row="0" col="1" :fncode="fncode" :properties="properties" :class="['m-l',properties.leftToRightSpace].join('-')"></TRARightPortion>
        </GridLayout>
    </App>
</template>

<script>
    import { mapGetters,mapActions,mapState } from 'vuex';
    import {ThisObj} from "../../../assets/scripts/mixins/tobj";
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";
    import {NewSalesOrderAdvanced} from "../../../assets/scripts/navigations";
    import {
        fetch_product_group_for_advance_transaction,
        fetch_product_list_for_advance_transaction
    } from "../../../assets/scripts/queries";
    import {FnPrint} from "../../../assets/scripts/mixins/fnprint";

    const TRF = ['docno','date','user','customer','store','fycode','fncode','payment_type','progress','_ref','status'];
    const TDF = ['so','store','fycode','fncode','product','quantity','rate','taxrule','tax','discount01','discount02','_ref'];
    const Layout = { Name:'narration',Quantity:'quantity',Total:'total',Rate:'rate',Tax:'taxdisplay',Discount:'discount' };

    const properties = {
        container: '99%',
        leftPortion: 440, leftToRightSpace: 10, containerPadding: 10,
        list01: 110, list02: 70, widthHeightRation: 1.3,
        itemsPerPage: 15, itemsPerRow: 5, itemSpacing: 10,
    };

    export default {
        name: "NewSalesOrderAdvanced",
        mixins: [EventListeners,ThisObj,FnPrint],
        props: ['store','fycode','fncode','title'],
        data(){ return {
            customer: null, payment_type: null, date: null, so: null, progress: 'Incomplete', status: 'Active',
            events: ['tra-header']
        } },
        computed: {
            ...mapGetters({ curDate:'date',user:'user',reference:'_ref',saleDocNo:'Reserves/get',toDateTime:'toDateTime' }),
            ...mapGetters({ customerDetail:'Customer/customer',productDetail:'Product/product' }),
            ...mapState('Product',{ productList:'list',productGroup:'group' }),

            properties(){ return properties; },
            taxEnabled(){ return (__.TAX === 'Yes' || __.TAX02 === 'Yes') },
        },
        methods: {
            ...mapActions({ saveSalesOrderTransaction:'Transaction/save',stockProduct:'Product/_stock' }),

            doStockProduct(query,key){ this.stockProduct({ query,key }); },

            _ref(){ return this.so = this.reference() },
            docno(){ return this.saleDocNo(this.store,this.fycode,this.fncode) },
            setHeader(data){ this.TO_SetPropFromObj(data); },
            layout(){ return this.taxEnabled ? Layout : _.omit(PLayouts,'tax') },
            reloadComp(){ this.$navigateTo(NewSalesOrderAdvanced.default,{ props:this.TO_Get(['store','fycode','fncode','title']) }); },
            listener0(data){ let hData = Object.assign({},data,{ date:this.toDateTime(data.date) }); this.setHeader(hData) },

            saveTransaction({ items,receipt }){
                if(items.length < 1) return alert('Please add products!!');
                let sales_order = this.TO_Get(TRF);
                let sales_order_items = _.map(items,(item) => this.TO_Get(TDF,item));
                this.saveSalesOrderTransaction({ sales_order,sales_order_items }).then(ref => {
                    if(receipt) return this.FnPrint({ _ref:ref }).then(() => this.reloadComp());
                    this.reloadComp();
                });
            },
        },
        created(){
            setTimeout(() => this.docno(),4000);
            if(this.productList.length === 0) this.doStockProduct(sql.format(fetch_product_list_for_advance_transaction),'list');
            if(this.productGroup.length === 0) this.doStockProduct(sql.format(fetch_product_group_for_advance_transaction),'group');
        }

    }
</script>
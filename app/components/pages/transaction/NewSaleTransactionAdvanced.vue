<template>
    <App :title="title" scroll="false" :width="properties.container">
        <GridLayout rows="*" :columns="[properties.leftPortion,'*'].join(',')">
            <TRALeftPortion row="0" col="0" :fncode="fncode" :layout="layout()" @save="saveTransaction" :seq="seq"></TRALeftPortion>
            <TRARightPortion row="0" col="1" :fncode="fncode" :properties="properties" :class="['m-l',properties.leftToRightSpace].join('-')" :seq="seq"></TRARightPortion>
        </GridLayout>
    </App>
</template>

<script>
    import { mapGetters,mapActions,mapState } from 'vuex';
    import {ThisObj} from "../../../assets/scripts/mixins/tobj";
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";
    import {
        fetch_product_group_for_advance_transaction,
        fetch_product_list_for_advance_transaction
    } from "../../../assets/scripts/queries";
    import {FnPrint} from "../../../assets/scripts/mixins/fnprint";
    import {FnShiftStatus} from "../../../assets/scripts/mixins/fnshiftstatus";
    import {FnDocReserve} from "../../../assets/scripts/mixins/fndocreserves";
    import {FiscalYearCheck} from "../../../assets/scripts/mixins/fiscalyearcheck";

    const TRF = ['_ref','user','store','docno','date','customer','fycode','fncode','payment_type','status'];
    const TDF = ['transaction','store','product','direction','quantity','rate','taxrule','tax','discount01','discount02','soi','shift_docno'];
    const Layout = { Name:'narration',Quantity:'quantity',Total:'total',Rate:'rate',Tax:'taxdisplay',Discount:'discount' };

    export default {
        name: "NewSaleTransactionAdvanced",
        mixins: [EventListeners,ThisObj, FnPrint, FnShiftStatus, FnDocReserve, FiscalYearCheck],
        props: ['store','fycode','fncode','title'],
        data(){ return {
            customer: null, payment_type: null, date: null, transaction: null, direction: 'Out', status: 'Active', soi:null,
            seq: 0, events: ['tra-header']
        } },
        computed: {
            ...mapGetters({ curDate:'date',user:'user',reference:'_ref',saleDocNo:'Reserves/get',toDateTime:'toDateTime' }),
            ...mapState('Product',{ productList:'list',productGroup:'group' }),
            ...mapGetters({ customerDetail:'Customer/customer',productDetail:'Product/product',settings:'Settings/all' }),
            taxEnabled(){ return (__.TAX === 'Yes' || __.TAX02 === 'Yes') },
            properties(){ let s = this.settings, n = _.toNumber; return {
                container: n(s.advance_sale_container_width) + "%",
                leftPortion: n(s.advance_sale_left_portion_width),
                leftToRightSpace: n(s.advance_sale_space_between_left_portion_and_right_portion),
                containerPadding: n(s.advance_sale_items_container_padding),
                list01: n(s.advance_sale_main_filter_width),
                list02: n(s.advance_sale_secondary_filter_height),
                widthHeightRatio: n(s.advance_sale_item_width_to_height_ratio),
                itemsPerPage: n(s.advance_sale_items_per_page),
                itemsPerRow: n(s.advance_sale_items_per_row),
                itemSpacing: n(s.advance_sale_space_between_each_item),
            } },
        },
        methods: {
            ...mapActions({ saveSaleTransaction:'Transaction/save', stockProduct:'Product/_stock' }),

            doStockProduct(query,key){ this.stockProduct({ query,key }); },

            _ref(){ return this.transaction = this.reference() },
            docno(){ return this.saleDocNo(this.store,this.fycode,this.fncode) },
            setHeader(data){ this.TO_SetPropFromObj(data); },
            layout(){ return this.taxEnabled ? Layout : _.omit(Layout,'Tax') },
            listener0(data){ let hData = Object.assign({},data,{ date:this.toDateTime(data.date) }); this.setHeader(hData) },
            reloadComp(){ this.seq++ },

            saveTransaction({ items,receipt }){
                if(!this.FDR_ready) return alert('No any document reserved!!');
                if(!this.SS_ready) return alert('Shift required!!');
                if(items.length < 1) return alert('Please add products!!');
                if(!this.FYC_Okey(this.date)) return alert(this.FYC_msg1);
                let transactions = this.TO_Get(TRF);
                let transaction_details = _.map(items,item => this.TO_Get(TDF,item));
                this.saveSaleTransaction({ transactions,transaction_details }).then(ref => {
                    if(receipt) return this.FnPrint({ _ref:ref }).then(() => this.reloadComp());
                    this.reloadComp();
                });
            },
        },
        created(){
            if(this.productList.length === 0) this.doStockProduct(sql.format(fetch_product_list_for_advance_transaction),'list');
            if(this.productGroup.length === 0) this.doStockProduct(sql.format(fetch_product_group_for_advance_transaction),'group');
        },
    }
</script>

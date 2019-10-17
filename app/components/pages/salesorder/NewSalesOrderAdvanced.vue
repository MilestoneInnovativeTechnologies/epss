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
    import {NewSalesOrderAdvanced, PrintModal} from "../../../assets/scripts/navigations";
    import {
        fetch_product_group_for_advance_transaction,
        fetch_product_list_for_advance_transaction
    } from "../../../assets/scripts/queries";

    const TRF = ['docno','date','user','customer','store','fycode','fncode','payment_type','progress','_ref'];
    const TDF = ['so','store','fycode','fncode','product','quantity','rate','taxrule','tax','discount01','discount02','_ref'];
    const Layout = { Name:'narration',Quantity:'quantity',Total:'total',Rate:'rate',Tax:'taxdisplay',Discount:'discount' };

    const properties = {
        container: '99%',
        leftPortion: 440, leftToRightSpace: 10, containerPadding: 10,
        list01: 110, list02: 70, widthHeightRation: 1.3,
        itemsPerPage: 15, itemsPerRow: 5, itemSpacing: 10,
    };

    const template = [
        { type:'raw',source:'sales_order',keys:{ docno:'Document',date:'Date',customer_name:'Customer',payment_type:'Payment Type' } },
        { type:'feed', amount:1 },
        { type:'table',source:'sales_order_items',heads:['Particulars','QTY','Rate','Total'],keys:['particular','quantity','rate','total'] },
        { type:'feed', amount:1 },
        { type:'raw',source:'summary',keys:{ subtotal:'Sub Total',totaltax:'Total Tax',totaldiscount:'Total Discount' } },
        { type:'line' },
        { type:'raw',source:'summary',keys:{ total:'Total Payable' } },
    ];


    export default {
        name: "NewSalesOrderAdvanced",
        mixins: [EventListeners,ThisObj],
        props: ['store','fycode','fncode','title'],
        data(){ return {
            customer: null, payment_type: null, date: null, so: null, progress: 'Incomplete',
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
            listener0(data){ let hData = Object.assign({},data,{ date:this.toDateTime(data.date) }); this.setHeader(hData) },

            saveTransaction({ items,receipt }){
                if(items.length < 1) return alert('Please add products!!');
                let sales_order = this.TO_Get(TRF);
                let sales_order_items = _.map(items,(item) => this.TO_Get(TDF,item));
                this.saveSalesOrderTransaction({ sales_order,sales_order_items }).then(ref => {
                    if(receipt) return this.$showModal(PrintModal,{ props: { title:this.title,data:this.getPrintDataObjects(sales_order,sales_order_items),template },fullscreen:true })
                        .then(print_data => this.$navigateTo(NewSalesOrderAdvanced,{ props:this.TO_Get(['store','fycode','fncode','title']) }));
                    this.$navigateTo(NewSalesOrderAdvanced,{ props:this.TO_Get(['store','fycode','fncode','title']) });
                });
            },





            getPrintDataObjects(sales_order, sales_order_items){
                sales_order = _.set(sales_order,'customer_name',sales_order.customer ? _.get(this.customerDetail(sales_order.customer),'name') : 'Cash Customer');
                sales_order['customer_name'] = sales_order.customer ? _.get(this.customerDetail(sales_order.customer),'name') : 'Cash Customer';
                sales_order_items = _.map(sales_order_items, detail => {
                    let prd = this.productDetail(detail.product);
                    detail['particular'] =`${prd.narration} ${ this.taxEnabled?`, ${detail.taxrule}: ${detail.tax}`:`` } ${ (detail.discount01+detail.discount02) ?`, Discount: ${detail.discount01+detail.discount02}`:`` }`;
                    detail['total'] =_.toNumber(detail.quantity)*_.toNumber(detail.rate)+_.toNumber(detail.tax)-_.toNumber(detail.discount01)-_.toNumber(detail.discount02);
                    return detail;
                });
                let summary = {
                    subtotal: _.sumBy(sales_order_items,(det) => _.toNumber(det.quantity)*_.toNumber(det.rate)),
                    totaltax: _.sumBy(sales_order_items,(det) => _.toNumber(det.tax)),
                    totaldiscount: _.sumBy(sales_order_items,(det) => _.toNumber(det.discount01)+_.toNumber(det.discount02)),
                    total: _.sumBy(sales_order_items,(det) => _.toNumber(det.quantity)*_.toNumber(det.rate)+_.toNumber(det.tax)-_.toNumber(det.discount01)-_.toNumber(det.discount02)),
                };
                return { sales_order,sales_order_items,summary };
            },









        },
        created(){
            setTimeout(() => this.docno(),4000);
            if(this.productList.length === 0) this.doStockProduct(sql.format(fetch_product_list_for_advance_transaction),'list');
            if(this.productGroup.length === 0) this.doStockProduct(sql.format(fetch_product_group_for_advance_transaction),'group');
        }

    }
</script>
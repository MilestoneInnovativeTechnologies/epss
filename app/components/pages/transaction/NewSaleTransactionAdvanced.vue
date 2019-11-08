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
    import {NewSaleTransactionAdvanced, PrintModal} from "../../../assets/scripts/navigations";
    import {
        fetch_product_group_for_advance_transaction,
        fetch_product_list_for_advance_transaction
    } from "../../../assets/scripts/queries";

    const TRF = ['_ref','user','store','docno','date','customer','fycode','fncode','payment_type','status'];
    const TDF = ['transaction','store','product','direction','quantity','rate','taxrule','tax','discount01','discount02','soi'];
    const Layout = { Name:'narration',Quantity:'quantity',Total:'total',Rate:'rate',Tax:'taxdisplay',Discount:'discount' };

    const template = [
        { type:'raw',source:'transactions',keys:{ docno:'Document',date:'Date',customer_name:'Customer',payment_type:'Payment Type' } },
        { type:'feed', amount:1 },
        { type:'table',source:'transaction_details',heads:['Particulars','QTY','Rate','Total'],keys:['particular','quantity','rate','total'] },
        { type:'feed', amount:1 },
        { type:'raw',source:'summary',keys:{ subtotal:'Sub Total',totaltax:'Total Tax',totaldiscount:'Total Discount' } },
        { type:'line' },
        { type:'raw',source:'summary',keys:{ total:'Total Payable' } },
    ];

    const properties = {
        container: '99%',
        leftPortion: 440, leftToRightSpace: 10, containerPadding: 10,
        list01: 110, list02: 70, widthHeightRation: 1.35,
        itemsPerPage: 100, itemsPerRow: 5, itemSpacing: 2,
    };

    export default {
        name: "NewSaleTransactionAdvanced",
        mixins: [EventListeners,ThisObj],
        props: ['store','fycode','fncode','title'],
        data(){ return {
            customer: null, payment_type: null, date: null, transaction: null, direction: 'Out', status: 'Active', soi:null,
            properties,
            events: ['tra-header']
        } },
        computed: {
            ...mapGetters({ curDate:'date',user:'user',reference:'_ref',saleDocNo:'Reserves/get',toDateTime:'toDateTime' }),
            ...mapState('Product',{ productList:'list',productGroup:'group' }),
            ...mapGetters({ customerDetail:'Customer/customer',productDetail:'Product/product' }),

            taxEnabled(){ return (__.TAX === 'Yes' || __.TAX02 === 'Yes') },
        },
        methods: {
            ...mapActions({ saveSaleTransaction:'Transaction/save', stockProduct:'Product/_stock' }),

            doStockProduct(query,key){ this.stockProduct({ query,key }); },

            _ref(){ return this.transaction = this.reference() },
            docno(){ return this.saleDocNo(this.store,this.fycode,this.fncode) },
            setHeader(data){ this.TO_SetPropFromObj(data); },
            layout(){ return this.taxEnabled ? Layout : _.omit(PLayouts,'tax') },
            listener0(data){ let hData = Object.assign({},data,{ date:this.toDateTime(data.date) }); this.setHeader(hData) },

            saveTransaction({ items,receipt }){
                if(items.length < 1) return alert('Please add products!!');
                let transactions = this.TO_Get(TRF);
                let transaction_details = _.map(items,item => this.TO_Get(TDF,item));
                this.saveSaleTransaction({ transactions,transaction_details }).then(ref => {
                    if(receipt) return this.$showModal(PrintModal,{ props: { title:this.title,data:this.getPrintDataObjects(transactions,transaction_details),template },fullscreen:true })
                        .then((print_data) => {
                            this.$navigateTo(NewSaleTransactionAdvanced,{ props:this.TO_Get(['store','fycode','fncode','title']) });
                        });
                    this.$navigateTo(NewSaleTransactionAdvanced,{ props:this.TO_Get(['store','fycode','fncode','title']) });
                });
            },






            getPrintDataObjects(transactions,transaction_details){
                transactions['customer_name'] = transactions.customer ? _.get(this.customerDetail(transactions.customer),'name') : 'Cash Customer';
                transaction_details = _.map(transaction_details,detail => {
                    let prd = this.productDetail(detail.product);
                    detail['particular'] =`${prd.narration} ${ this.taxEnabled?`, ${detail.taxrule}: ${detail.tax}`:`` } ${ (detail.discount01+detail.discount02) ?`, Discount: ${detail.discount01+detail.discount02}`:`` }`;
                    detail['total'] =_.toNumber(detail.quantity)*_.toNumber(detail.rate)+_.toNumber(detail.tax)-_.toNumber(detail.discount01)-_.toNumber(detail.discount02);
                    return detail;
                });
                let summary = {
                    subtotal: _.sumBy(transaction_details,(det) => _.toNumber(det.quantity)*_.toNumber(det.rate)),
                    totaltax: _.sumBy(transaction_details,(det) => _.toNumber(det.tax)),
                    totaldiscount: _.sumBy(transaction_details,(det) => _.toNumber(det.discount01)+_.toNumber(det.discount02)),
                    total: _.sumBy(transaction_details,(det) => _.toNumber(det.quantity)*_.toNumber(det.rate)+_.toNumber(det.tax)-_.toNumber(det.discount01)-_.toNumber(det.discount02)),
                };
                return { transactions, transaction_details, summary };
            }
        },
        created(){
            setTimeout(() => this.docno(),4000);
            if(this.productList.length === 0) this.doStockProduct(sql.format(fetch_product_list_for_advance_transaction),'list');
            if(this.productGroup.length === 0) this.doStockProduct(sql.format(fetch_product_group_for_advance_transaction),'group');
        }
    }
</script>
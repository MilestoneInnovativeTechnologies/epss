<template>
    <GridLayout rows="auto,*,auto,auto" columns="*">
        <WSSaleCustomer row="0" col="0"></WSSaleCustomer>
        <StackLayout row="1" col="0">
            <CustomerPendingSOList v-if="customer" :customer="customer" :key="customer" class="m-t-20"></CustomerPendingSOList>
            <AppList title="Items" :layout="layout" :source="items" :key="['SI',totalAmount].join('-')" class="m-t-20" action="pick" @collection="setSelectedItem" :selected="selectedIndex"></AppList>
            <CalculateDiscount :total="totalAmount" @discount="setDiscount" v-if="totalAmount > 0 && false" class="m-t-20"></CalculateDiscount>
            <PayableAmount :total="totalAmount" :tax="getSumOf('tax')" :discount="finalDiscount" class="m-t-20"></PayableAmount>
        </StackLayout>
        <WSSaleItemActions  row="2" col="0" @delete="deleteSelectedItem" @edit="editSelectedItem" class="m-t-20"></WSSaleItemActions>
        <AppButton  row="3" col="0" class="c-white btn-active m-t-20" width="100%" @tap.native="save">SAVE</AppButton>
    </GridLayout>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {SalesOrderToSaleItems} from "../../../../assets/scripts/mixins/salesordertosaleitems";
    const dialogs = require('tns-core-modules/ui/dialogs');

    export default {
        name: "WSSaleNewLeftPortion",
        mixins: [SalesOrderToSaleItems],
        data(){ return {
            customer: null, fncode: null,
            layout: { ITEM:'name',QUANTITY:'quantity',AMOUNT:'total' },
            items: [], selectedItem: null, finalDiscount: 0, selectedIndex: null,
            iProducts: {}
        } },
        computed: {
            ...mapGetters({ calculateTotal:'total',getProductTax:'Product/tax',getTransReferenceId:'_ref' }),
            totalAmount(){ let items = this.items; return this.getSumOf('total') },
        },
        methods: {
            addItem(item){
                let product = item.id; if(!_.has(item,'_ref')) item._ref = this.getTransReferenceId(); if(!_.has(item,'discount')) item.discount = 0;
                if(!_.has(this.iProducts,product)) { this.iProducts = Object.assign({},this.iProducts,_.zipObject([product],[this.items.push(item)-1])); }
                else this.updateItemQuantity(this.iProducts[product],item.quantity || 1);
                this.selectedIndex = this.iProducts[product];
            },
            updateItemQuantity(index,qty,set){
                let item = this.items[index]; if(!item) return;  let quantity = set ? _.toNumber(qty) : (_.toNumber(item.quantity) + _.toNumber(qty)),
                    total = this.calculateTotal(item.rate,quantity,item.tax);
                this.items[index].quantity = quantity; this.items[index].total = total;
            },
            getSumOf(key){  let items = this.items; return _.sumBy(items,(item) => _.toNumber(item[key]) )  },
            setSelectedItem(rows){ this.selectedItem = rows[0]; },
            setDiscount(discount){ this.finalDiscount = _.toNumber(discount) },
            deleteSelectedItem(){ if(!this.selectedItem || _.isNil(this.iProducts[this.selectedItem.id])) return;
                this.items.splice(this.iProducts[this.selectedItem.id],1); this.iProducts = _.invert(_.map(this.items,'id'));
                this.selectedItem = null; this.selectedIndex = (this.items.length < 1) ? null : this.items.length-1;
            },
            editSelectedItem(){ if(!this.selectedItem || _.isNil(this.iProducts[this.selectedItem.id])) return;
                let si = this.selectedItem, vm = this, title = 'Edit Quantity', message = 'Enter new quantity for '+ si.name, defaultText = si.quantity;
                dialogs.prompt({ title, message, okButtonText:'Update', cancelButtonText:'Cancel', defaultText })
                    .then(({ result,text }) => { if(result) vm.updateItemQuantity(vm.iProducts[si.id],text,true) },() => {
                        prompt('Enter new quantity').then(({ result,text }) => { if(result) vm.updateItemQuantity(vm.iProducts[si.id],text,true) });
                    })
            },
            save(){
                if(!this.customer) return alert('Please select customer and sale details');
                if(!this.items.length) return alert('Please add items');
                this.$emit('save',this.items);
            }
        },
        created(){
            EB.$on('wssale-sale-detail',(data) => { this.customer = data.customer; this.fncode = data.type; });
            EB.$on('customer-pending-sales-orders-selected',(data) => {
                if(!data) return; let _refs = _.map(data,'_ref'), items = _.flatMap(_refs,id => this.SOSI(id));
                items.forEach((item) => this.addItem(item));
            });
            EB.$on('wssale-item-selected',(item) => {
                let taxDetails = this.getProductTax(item.id,this.fncode);
                item = Object.assign({},item,{ quantity:1, rate:item.price, taxcode:taxDetails[0], tax:taxDetails[1], total:this.calculateTotal(item.price,1,taxDetails[1]) });
                this.addItem(item);
            })
        },
    }
</script>
<template>
    <GridLayout rows="auto,*,auto,auto" columns="*">
        <TRAHeader row="0" :seq="seq" />
        <GridLayout row="1" rows="*,auto">
            <ScrollView row="0" ref="items_scroller">
                <AppList :layout="layout" :source="PS_items" :key="['nsta-al',PS_update,listUpdate].join('-')" class="m-0" action="pick" @collection="setPicked" :selected="selectedIndex"></AppList>
            </ScrollView>
            <PayableAmount row="1" class="m-t-0" :amount="PS_TotalAmount" :tax="PS_TotalTax" :discount="PS_TotalDiscount" />
        </GridLayout>
        <TRAItemActions row="2" v-if="selectedItem.pid" :key="'TRAIA-'+selectedItem.pid" class="m-t-10" :item="selectedItem" @update="updateItem"></TRAItemActions>
        <GridLayout row="3" columns="2*,3*" class="m-t-0">
            <AppButton col="0" class="c-white btn-active m-x-0" @tap.native="saveTransaction">SAVE</AppButton>
            <AppButton col="1" class="c-white btn-active m-x-0" @tap.native="saveAndPrintTransaction">SAVE AND PRINT</AppButton>
        </GridLayout>
    </GridLayout>
</template>

<script>
    import {ProductSale} from "../../../assets/scripts/mixins/productsale";
    import {EventListeners} from "../../../assets/scripts/mixins/eventlisteners";
	const timer = require('@nativescript/core/timer');

    export default {
        name: "TRALeftPortion",
        props: ['fncode','layout','seq'],
        mixins: [ProductSale,EventListeners],
        data(){ return {
            selectedItem: {},
            events: ['tra-item-selected'],
            listUpdate: 0
        } },
        computed: {
            selectedIndex(){
                let items = this.PS_items, selected = this.selectedItem;
                return (items && items.length && selected && !_.isEmpty(selected)) ? this.PS_ProductIndex(this.selectedItem.pid) : 0;
            }
        },
        methods: {
            updateItem({ item,key,value }){
                if(key === 'remove') this.setSelected(this.PS_DeleteItem(item) === null);
                else this.PS_SetAndUpdate(item,key,value);
                this.listUpdate++;
            },
            listener0({ id }){ this.addItem(id); },
            setPicked(row){ this.setSelected(row[0]); },
            addItem(pid){
                let idx = this.PS_ProductIndex(pid);
                if(idx === -1) this.PS_AddItem(pid,1);  else this.PS_UpdateQuantity({ pid,quantity:1 });
                this.listUpdate++; timer.setTimeout(this.scrollToBottom,250); this.setSelected();
            },
            setSelected(item){
                this.selectedItem = Object.assign({},this.selectedItem,item || this.PS_items[this.PS_items.length - 1]);
            },
            scrollToBottom(){
                let items_scroller = this.$refs['items_scroller'].nativeView;
                items_scroller.scrollToVerticalOffset(items_scroller.scrollableHeight, true);
            },
            saveTransaction(){
                let items = this.PS_items;
                this.$emit('save',{ items,receipt:false })
            },
            saveAndPrintTransaction(){
                let items = this.PS_items;
                this.$emit('save',{ items,receipt:true })
            }
        },
        watch: {
            seq: 'PS_DeleteAllItem'
        }
    }
</script>

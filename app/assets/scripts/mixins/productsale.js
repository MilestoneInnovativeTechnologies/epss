import { mapGetters } from "vuex";

export const ProductSale = {
    data(){ return {
        PS_items: [],
        PS_update: 0,
    } },
    computed: {
        ...mapGetters({ PS_ProductDetail:'FN/saleItemBasic',PS_SaleItem:'FN/saleItem',reference:'_ref' }),
        PS_TotalTax(){ let items = this.PS_items; return GetSumOfItemsKey(items,'tax'); },
        PS_TotalDiscount(){ let items = this.PS_items; return GetSumOfItemsKey(items,'discount'); },
        PS_TotalAmount(){ let items = this.PS_items; return GetSumOfItemsKey(items,'amount'); },
        PS_TotalQuantity(){ let items = this.PS_items; return GetSumOfItemsKey(items,'quantity'); },
        PS_Total(){ let items = this.PS_items; return GetSumOfItemsKey(items,'total'); },
    },
    methods: {
        PS_GetProductDetail(code){
            return this.PS_ProductDetail(this.fncode,code)
        },
        PS_GetAddProduct(code,quantity,rate,discount){
            return this.PS_SaleItem(this.fncode,code,quantity,{ rate,discount })
        },
        PS_AddItem(code,quantity,rate,discount){
            let item = this.PS_GetAddProduct(code,quantity,rate,discount);
            let productIndex = this.PS_ProductIndex(item.pid);
            if(productIndex === -1) return this.PS_DoAddProduct(item);
            let vm = this;
            confirm({ title:'Selected item is already added once!',message:'Do you want to update the quantity, or replace with current details',okButtonText:'UPDATE',cancelButtonText:'REPLACE' })
                .then(response => {
                    if(response) vm.PS_UpdateQuantity(item);
                    else vm.PS_ReplaceItem(item);
                });
        },
        PS_ProductIndex(code){ return _.findIndex(this.PS_items,(item) => item.pid == code); },
        PS_DoAddProduct(item) { this.PS_items.push(_.set(item,'_ref',this.reference())); },
        PS_SetAndUpdate(item,key,value){
            let psItem = this.PS_items[this.PS_ProductIndex(_.isObject(item) ? item.pid : item)];
            psItem[key] = value;
            let nItem = this.PS_GetAddProduct(psItem.pid,psItem.quantity,psItem.rate,psItem.discount);
            this.PS_ReplaceItem(nItem);
        },
        PS_UpdateQuantity(item){
            let { pid,quantity,rate,discount } = this.PS_items[this.PS_ProductIndex(item.pid)];
            quantity = quantity + item.quantity;
            let nItem = this.PS_GetAddProduct(pid,quantity,rate,discount);
            this.PS_ReplaceItem(nItem);
        },
        PS_ReplaceItem(item){
            this.PS_DeleteItem(item.pid);
            this.PS_DoAddProduct(item);
            this.PS_update++;
        },
        PS_DeleteItem(pid){
            let idx = this.PS_ProductIndex(_.isObject(pid) ? pid.pid : pid);
            if(idx > -1) return this.PS_items.splice(idx,1);
            return false;
        },
        PS_DeleteAllItem(){
            return this.PS_items.splice(0,this.PS_items.length);
        },
    }
};

function GetSumOfItemsKey(items,key){
    return _(items).map(item => _.toNumber(item[key])).sum();
}

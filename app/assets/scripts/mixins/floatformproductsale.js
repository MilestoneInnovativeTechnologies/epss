import {EventListeners} from "./eventlisteners";
import {ProductSale} from "./productsale";
const feMX = require('./../../../assets/scripts/mixins/formelement');

const fields = { product:'Product',quantity:'Quantity',rate:'Rate',discount:'Decimal' };
const labels = { discount:'Discount' };
const values = { quantity: 1,discount:0,rate:0 };
const title = 'Add Products';

export const FloatFormProductSale = {
    mixins: [EventListeners, ProductSale, feMX.common,feMX.product,feMX.quantity,feMX.rate,feMX.decimal],
    data(){ return {
        FFPS_CurrentProduct: null,
        FFPS_CurrentItem: null,
    } },
    methods: {
        FFPS_ShowForm(){
            this.ELOn('absolute-form-field-product',this.FFPS_ProductChanged);
            this.ELOn('absolute-form-submit',this.FFPS_ProductAdd);
            this.ELOn('absolute-form-close',this.FFPS_Close);
            this.ELEmit('absolute-form',{ title,fields:labelMorph(this.appFormFields(fields)),values,action:'Add',catch:['product'] });
        },
        FFPS_ProductChanged(product){
            if(this.FFPS_CurrentProduct == product) return;
            this.FFPS_CurrentProduct = product;
            this.FFPS_CurrentItem = this.PS_GetProductDetail(product);
            this.ELEmit('absolute-form-values',{ product,rate:this.FFPS_CurrentItem.rate });
        },
        FFPS_ProductAdd({ product,quantity,rate,discount }){
            this.PS_AddItem(product,quantity,rate,discount); let count = this.PS_items.length, amount = this.PS_Total;
            this.ELEmit('absolute-form-notify',`${quantity} quantity of ${this.FFPS_CurrentItem.name} added successfully!!\nTotal Items added: ${count}\nTotal Amount: ${amount}`);
            this.ELEmit('absolute-form-values',values);
        },
        FFPS_Close(){
            this.ELOff('absolute-form-field-product',this.FFPS_ProductChanged);
            this.ELOff('absolute-form-submit',this.FFPS_ProductAdd);
        }
    }
};

function labelMorph(fields){
    let returnFields = fields;
    _.intersection(_.keys(fields),_.keys(labels)).forEach(field => returnFields[field].label = labels[field]);
    return returnFields;
}
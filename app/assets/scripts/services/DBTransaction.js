export class DBTransaction {
    constructor(extras){
        this._TRF = ['_ref','user','store','docno','date','customer','fycode','fncode','payment_type','status'];
        this._TDF = ['transaction','store','product','direction','quantity','rate','taxrule','tax','discount01','discount02','soi'];
        this.set(extras);
    }
    prepare(items){
        let transactions = this.prepare_transaction();
        let transaction_details = this.prepare_transaction_details(items);
        return { transactions, transaction_details }
    }
    set(obj){ for(let x in obj) this[x] = obj[x]; }
    get(key,obj){ obj = obj || this; return _.has(obj,key) ? obj[key] : (_.has(this,key) ? this[key] : null); }
    prepare_transaction(){
        return _.zipObject(this._TRF,_.map(this._TRF,(key) => this.get(key)));
    }
    prepare_transaction_details(items){
        let that = this;
        return _.map(items,(item) => _.zipObject(that._TDF,_.map(that._TDF,(key) => that.get(key,item))));
    }
}
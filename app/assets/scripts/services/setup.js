export class SSSetup {
    constructor(records){
        let ignoreKeys = ['id','created_at','updated_at'];
        _.forEach(records,(record) => _.includes(ignoreKeys,record.name) ? '' : this.setValue(record.name,record.value) );
        console.log('SETUP DONE');
    }
    setValue(name,value){ this[name] = value; }
    correctedDateFormat(format){ return format.replace(/dd|yy/g,(x) => x.toUpperCase()) }
    quantity(num){ return _.round(_.toNumber(num),this.QUANTITY_DECIMAL) }
    rate(num){ return _.round(_.toNumber(num),this.RATE_DECIMAL) }
    amount(num){ return _.round(_.toNumber(num),this.AMOUNT_DECIMAL) }
    currency(num){ return _.round(_.toNumber(num),this.CURRENCY_DECIMAL) }
    docdate(date){ return moment(date).format(this.correctedDateFormat(this.DOCDATE_FORMAT)) }
    refdate(date){ return moment(date).format(this.correctedDateFormat(this.REFDATE_FORMAT)) }
    chqdate(date){ return moment(date).format(this.correctedDateFormat(this.CHQDATE_FORMAT)) }
    date(date){ return moment(date).format(this.correctedDateFormat(this.OTHDATE_FORMAT)) }
    cast(Obj,rule){
        if(!_.isObject(Obj) && !_.isString(rule)) return this[rule](Obj);
        if(_.isEmpty(rule)) return Obj;
        if(_.isArray(Obj)) return _.map(Obj,(obj) => this.cast(obj,rule));
        let castKeys = _.keys(rule);
        return _.mapValues(Obj,(value,name) => _.includes(castKeys,name) ? this[rule[name]](value) : value)
    }
    now(){ return parseInt(new Date().getTime()/1000) }
    dtz(dt){ return parseInt(moment(dt).format('X')) }
    time(){ return moment().format('hh:mm:ss') }
}
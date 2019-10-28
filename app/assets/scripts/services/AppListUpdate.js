export class AppListUpdate {
    constructor() {
        this.valName = 'value';
        this.action = 'UPDATE';
        this.title = 'NEW VALUE';
        this.field = { index:0,label:'',name:'value',type:'' };
        this.fields = _.zipObject([this.valName],[this.field]);
        this.values = _.zipObject([this.valName],['']);
    }
    value(obj,value){
        obj['values'][this.valName] = value;
        return obj;
    }
    init(data){
        return Array.isArray(data) ? this.getUpdatesFromArray(data) : this.getUpdatesFromObject(data);
    }
    getUpdatesFromArray(array){
        if(_.isEmpty(array)) return {}; let object = _.zipObject(array,[]);
        return this.getUpdatesFromObject(object);
    }
    getDefaultData(){
        let { fields,values,action,title } = this;
        return { fields,values,action,title }
    }
    getUpdatesFromObject(object){
        let value = this.valName, dObject = this.getDefaultData();
        return _.mapValues(object,function(rObj){
            let dObj = _.cloneDeep(dObject);
            dObj['fields'][value].type = _.has(rObj,'type') ? rObj.type : 'Text';
            if(_.has(rObj,'field')) dObj['fields'][value] = rObj.field;
            return Object.assign({},dObj,rObj);
        });
    }
}
const fsm = require('tns-core-modules/file-system');

export class DBCache {
    constructor(table,data){
        this.table = table;
        this.path = 'tblData';
        this.fileName = table + '.json';
        this.file = fsm.knownFolders.currentApp().getFolder(this.path).getFile(this.fileName);
        this.data = [];
        if(data) this.file.writeText(JSON.stringify(data)).then(() => this.getData());
        else this.getData();
    }
    getData(){ this.file.readText().then(res => this.data = JSON.parse(res || "[]")); }
    all(){ return this.data }
    dataByGroup(field){ return _.groupBy(this.data,field) }
    dataByField(field){ return _.keyBy(this.data,field) }
    dataById(){ return this.dataByField('id') }
    dataByIdField(field){ return _.mapValues(this.dataById(),(field || 'name')) }
    dataByIdName(){ return this.dataByIdField('name') }
    dataItemByKey(key,value){ return _.find(this.data,this.mpkva(key,value)) }
    dataItem(id){ return this.dataItemByKey('id',id) }
    dataFilter(key,value){ return _.filter(this.data,this.mpkva(key,value)) }

    matchesPropertyKeyValueArray(key,value){
        let intKeys = ['id','created_at','updated_at'];
        let val = _.includes(intKeys,key) ? _.toSafeInteger(value) : _.toString(value);
        return [key,val];
    }
    mpkva(key, value) { return this.matchesPropertyKeyValueArray(key, value) }
}
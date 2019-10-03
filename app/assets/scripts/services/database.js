const Sqlite = require('nativescript-sqlite');
const { path, knownFolders } = require('tns-core-modules/file-system');
import { SSSetup } from './setup'

class Database {
    constructor() {
        this.variables();
        if (!Sqlite.exists(this.dbFile)) sLog('No DB Found, Creating one');
        (new Sqlite(this.dbFile))
            .then((db) => {
                db.resultType(Sqlite.RESULTSASOBJECT);
                db.valueType(Sqlite.VALUESARESTRING);
                this.database = db;
                sLog('DB Connection Success');
                db.all('SELECT * FROM setup',function(error,rows){ global.__ = new SSSetup(rows); })
            })
            .catch(e => sLog('DB Connection Failed..' + e));
    }

    variables() {
        this.database = null;
        this.fileName = 'epss';
        this.tbl = null;
        this.result = null;
        this.error = false;
        this.success = true;
        this.root = path.join(knownFolders.documents().path, 'database');
        this.dbFile = path.join(this.root, this.fileName + '.db');
        this.executedQuery = [];
    }

    table(tbl) {
        if(!tbl) return this.tbl;
        this.tbl = tbl; this.error = false;
        return this;
    }

    insert(tbl,data,callback,...args){
        sLog(this.table(tbl).tbl + ' -> Insert');
        let insert = this.dataToInsert(data);
        let query = sql.format(`INSERT INTO ?? (??) VALUES ?`,[tbl,insert.names,insert.values]);
        this.query(query,callback,...args);
    }

    update(tbl,condition,data,callback,...args){
        sLog(this.table(tbl).tbl + ' -> Update');
        let update = this.dataToUpdate(data);
        condition = this.correctCondition(condition);
        let query = sql.format(`UPDATE ?? SET ? WHERE ${condition}`,[tbl,update]);
        this.query(query,callback,...args);
    }

    correctCondition(condition){
        if(_.isString(condition) || _.isNumber(condition)) return `id = ${condition}`;
        if(_.isArray(condition)){
            if(this.isSimpleArray(condition)) return `id IN (${condition.join(',')})`;
            return this.objArrayToCondition(condition);
        }
        if(_.isObject(condition)) return this.objArrayToCondition([condition]);
        return `id = 0`;
    }

    query(query, callback, ...args) {
        this.exeQuery(query);
        return this.database.execSQL(query, (error, result) => {
            this.postQuery.call(this,query,error,result,callback,args);
        })
    }

    delete(tbl,condition,callback,...args){
        sLog(this.table(tbl).tbl + ' -> Delete');
        let query = `DELETE FROM ${this.tbl}`;
        if(_.isNil(condition)) return this.query(query,callback,...args);
        let where = this.correctCondition(condition);
        return this.query(`${query} WHERE ${where}`,callback,...args);
    }

    get(tbl,condition,callback,...args){
        sLog(this.table(tbl).tbl + ' -> Select');
        if(_.isNil(condition)) return this.getAll(callback,args);
        if(_.isString(condition) || _.isNumber(condition)) return this.getWithID(condition,callback,args);
        if(_.isArray(condition)){
            if(this.isSimpleArray(condition)) return this.getIn(condition,callback,args);
            return this.getObjArray(condition,callback,args);
        }
        return this.getObjArray([condition],callback,args);
    }

    getAll(callback,args){
        let query = `SELECT * FROM ${this.tbl}`;
        return this.getAllQuery(query,callback,args);
    }
    getWithID(id,callback,args){
        let query = `SELECT * FROM ${this.tbl} WHERE id = ?`;
        this.exeQuery(query);
        return this.database.get(query,[id],(error,result) => {
            this.postQuery.call(this,query,error,result,callback,args);
        });
    }
    getIn(ids,callback,args){
        let query = `SELECT * FROM ${this.tbl} WHERE id IN (${ ids.join(',') })`;
        return this.getAllQuery(query,callback,args);
    }
    getObjArray(array,callback,args){
        let where = this.objArrayToCondition(array);
        let query = `SELECT * FROM ${this.tbl} WHERE ${where}`;
        return this.getAllQuery(query,callback,args);
    }

    getAllQuery(query,callback,args){
        this.exeQuery(query);
        return this.database.all(query,(error,rows) => {
            this.postQuery.call(this,query,error,rows,callback,args);
        })
    }
    getAllQueryParams(query,params,callback,args){
        params = _.isArray(params) ? params : [params];
        this.exeQuery(query);
        return this.database.all(query,params,(error,rows) => {
            this.postQuery.call(this,query,error,rows,callback,args);
        })
    }

    dataToInsert(data){
        data = _.isArray(data) ? data : [data];
        let names = ['created_at','updated_at'], nameObj = { created_at:0,updated_at:1 }, values = [];
        _.forEach(data,(record) => {
            let time = parseInt(new Date().getTime()/1000);
            let value = [time,time];
            _.forEach(record,(val,key) => {
                let idx = nameObj[key]; if(idx === null || idx === undefined) { idx = names.push(key)-1; nameObj[key] = idx; }
                let sVal = (_.includes(val,"'") || _.includes(val,'"')) ? val.replace(/['"]/g,() => ' ') : val;
                _.set(value,idx,sVal);
            });
            values.push(value)
        });
        return { names:names,values:values }
    }

    dataToUpdate(data) {
        let time = parseInt(new Date().getTime()/1000);
        let sets = { updated_at:time };
        _.forEach(data, (val, key) => {
            _.set(sets,key,val);
        });
        return sets;
    }

    isSimpleArray(array){ return _.every(array,(element) => (_.isNumber(element) || _.isString(element)) ); }
    objToCondition({ field,value,operator,precedent }){
        operator = operator || '=';
        precedent = (precedent === true) ? 'AND' : (precedent || '');
        return [precedent,`\`${field}\``,operator,_.isNumber(value)?value:`"${value}"`].join(' ');
    }
    toCorrectObj(obj,operator,precedent){
        let objArray = [];
        _.forEach(obj,(val,key) => {
            if(!_.includes(['operator','precedent'],key))
                objArray.push(_.zipObject(['field','value','operator','precedent'],[key,val,operator || '=',precedent]))
        });
        return objArray;
    }
    getCorrectedObj(obj){
        if(_.has(obj,'operator')){
            if(_.has(obj,['field','value'])) return obj;
            return this.toCorrectObj(obj,obj.operator,obj.precedent);
        } else {
            return this.toCorrectObj(obj,'=',obj.precedent);
        }
    }
    objArrayToCondition(array){
        let correctedObj = _.flatMap(array,(eleObj) => this.getCorrectedObj(eleObj));
        return _.map(correctedObj,(condObj,idx) => {
            if(idx && !condObj.precedent) condObj.precedent = true;
            if(idx === 0 && condObj.precedent) condObj.precedent = '';
            return this.objToCondition(condObj);
        }).join(' ');
    }

    postQuery(query,error,result,callback,args){
        this.error = !!error; this.success = !error;
        if (error) {
            sLog(this.tbl + ' -> Error');
            this.result = error;
        } else {
            sLog(this.tbl + ' -> Success');
            this.result = result;
        }
        if(callback) callback.apply(this,args);
    }

    drop(tbl) { this.table(tbl); return this.query(`DROP TABLE IF EXISTS "${tbl}"`); }
    create(tbl, fields, callback, ...args) {
        let idxFs = '';
        if(callback && typeof callback !== 'function'){ idxFs = callback; callback = args[0]; args = args.splice(1); }
        sLog(tbl+' -> Create');
        this.drop(tbl); let query = [this.create_Q(tbl, fields),this.create_IDXs(tbl,idxFs)].join(' ');
        return this.query(query,callback,...args);
    }
    create_idField() { return '"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'; }
    create_CAField() { return this.create_I('created_at'); }
    create_UAField() { return this.create_I('updated_at'); }
    create_T(field) { return `"${field}" TEXT`; }
    create_I(field) { return `"${field}" INTEGER`; }
    create_FS(fields) { return _.map(_.split(fields, ','), (field) => {return this.create_T(field);}) }
    create_AFS(fields) { return _.concat(this.create_idField(), this.create_FS(fields), this.create_CAField(), this.create_UAField()); }
    create_Q(tbl, fields) { return `CREATE TABLE "${tbl}" ( ${this.create_AFS(fields).join(', ')} );`; }
    create_IDXs(tbl,fields){ if(!fields) return ''; return fields.split(',').map(fld => this.create_IDX(tbl,fld)).join(' '); }
    create_IDX(tbl,fld){ return `CREATE INDEX "${tbl}_${fld}_index" ON "${tbl}" ("${fld}");` }

    exeQuery(query){
        this.executedQuery.unshift(query);
        this.executedQuery.splice(5);
    }
    log(){ return this.executedQuery }
}

function sLog(text) {
    if (TNS_ENV === 'production') return;
    console.log('DB: '+ text);
}


export const DB = new Database();
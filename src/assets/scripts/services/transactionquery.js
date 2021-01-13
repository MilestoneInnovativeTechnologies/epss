export const TransactionQueryBuilder = class {
    constructor(limit){
        this.fieldMaps = { docno:'TR.`docno`',fycode:'TR.`fycode`',fncode:'TR.`fncode`',customer:'U.`name`',date:'TR.`date`',quantity:'TD.`quantity`',tax:'TD.`tax`',discount01:'TD.`discount01`',discount02:'TD.`discount02`',store:'ST.`name`',product:'P.`narration`',code:'P.`code`',rate:'TD.`rate`',taxValue:'TD.`tax`',taxRule:'TD.`taxrule`',direction:'TD.`direction`',cid:'TR.`customer`',pid:'TD.`product`',sid:'TR.`store`',id:'TR.`_ref`',eid:'E.`id`',executive:'E.`name`' };
        this.tableMap = { TR:'transactions',TD:'transaction_details',ST:'stores',P:'products',U:'users',E:'users' };
        this.dependTables = { P:['TD'] };
        this.tableJoin = { TD:'TR.`_ref` = TD.`transaction`',ST:'TR.`store` = ST.`id`',P:'TD.`product` = P.`id`',U:'(TR.`customer` = U.`id` OR TR.`customer` IS NULL)',E:'TR.`user` = E.`id`' };
        this.typeWhere = [];
        this.limit = `0,${limit || 1}`;
    }
    fields(fields){
        this.rFields = fields;
        this.select = _.map(this.rFields,(field) => `${this.fieldMaps[field]} '${field}'`);
        this.tables = _.filter(_.uniq(_.flattenDeep(_.map(this.rFields,(field) => { let tbl = this.fieldMaps[field].split('.')[0],dTbls = this.dependTables[tbl]; return [tbl,dTbls]; } ))));
        this.froms = _.map(this.tables,(tbl) => `${this.tableMap[tbl]} ${tbl}` );
        this.ons = _.filter(_.map(this.tables,(tbl) => this.tableJoin[tbl] ));
        return this;
    }
    where(whereObj){
        this.rWhere = _.map(this.fieldMaps,(field,name) => { if(whereObj[name]){ return (_.isArray(whereObj[name])) ? `${this.fieldMaps[name]} IN ('${whereObj[name].join("','")}')` : `${this.fieldMaps[name]} = '${whereObj[name]}'` } });
        return this;
    }
    max(num){
        this.limit = `0,${num}`;
        return this;
    }
    query(){
        this.aWhere = _.concat(this.ons,this.typeWhere,_.filter(this.rWhere));
        return `SELECT ${this.select.join(',')} FROM ${this.froms.join(',')} WHERE ${this.aWhere.join(' AND ')} ORDER BY datetime(TR.\`date\`) DESC LIMIT ${this.limit}`;
    }
};
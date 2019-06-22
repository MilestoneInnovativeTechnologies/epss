export const TransactionQueryBuilder = class {
    constructor(type){
        this.fieldMaps = { docno:'TR.`docno`',customer:'U.`name`',date:'TR.`date`',quantity:'SPT.`quantity`',nature:'PTN.`name`',total:'TD.`total`',price:'TD.`price`',tax:'TD.`tax`',discount:'TD.`discount`',store:'ST.`name`',product:'P.`name`',direction:'SPT.`direction`',type:'PTT.`name`',cid:'TR.`customer`',pid:'SPT.`product`',sid:'SPT.`store`',id:'TR.`_ref`',eid:'E.`id`',executive:'E.`name`' };
        this.tableMap = { TR:'transactions',TD:'transaction_details',SPT:'store_product_transactions',PTN:'product_transaction_natures',PTT:'product_transaction_types',ST:'stores',P:'products',U:'users',E:'users' };
        this.dependTables = { SPT:['TD'],PTN:['TD','SPT'],PTT:['TD','SPT'],ST:['TD','SPT'],P:['TD','SPT'] };
        this.tableJoin = { TD:'TR.`_ref` = TD.`transaction`',SPT:'TD.`spt` = SPT.`_ref`',PTN:'SPT.`nature` = PTN.`id`',PTT:'SPT.`type` = PTT.`id`',ST:'SPT.`store` = ST.`id`',P:'SPT.`product` = P.`id`',U:'TR.`customer` = U.`id`',E:'TR.`user` = E.`id`' };
        this.typeWhere = [`TR.\`fncode\` LIKE "${type}%"`];
        this.limit = '0,100';
    }
    fields(fields){
        this.rFields = fields;
        this.select = _.map(this.rFields,(field) => `${this.fieldMaps[field]} ${field}`);
        this.tables = _.filter(_.uniq(_.flattenDeep(_.map(this.rFields,(field) => { let tbl = this.fieldMaps[field].split('.')[0],dTbls = this.dependTables[tbl]; return [tbl,dTbls]; } ))));
        this.froms = _.map(this.tables,(tbl) => `${this.tableMap[tbl]} ${tbl}` );
        this.ons = _.filter(_.map(this.tables,(tbl) => this.tableJoin[tbl] ));
        return this;
    }
    where(whereObj){
        this.rWhere = _.map(this.fieldMaps,(field,name) => { if(whereObj[name]){ return (_.isArray(whereObj[name])) ? `${this.fieldMaps[name]} IN ("${whereObj[name].join('","')}")` : `${this.fieldMaps[name]} = "${whereObj[name]}"` } });
        return this;
    }
    max(num){
        this.limit = `0,${num}`;
        return this;
    }
    query(){
        this.aWhere = _.concat(this.ons,this.typeWhere,_.filter(this.rWhere));
        return `SELECT ${this.select.join(',')} FROM ${this.froms.join(',')} WHERE ${this.aWhere.join(' AND ')} ORDER BY TR.\`date\` DESC LIMIT ${this.limit}`;
    }
};
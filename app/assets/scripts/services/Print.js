const PrintTemplate = new (require('./PrintTemplate').PrintTemplate)();
const doPrint = require('./Printer.js').print;

export class Print {
    constructor(id){
        this.prop = {}; this.query1_result = null; this.query2_result = null; this.query3_result = null; this.tObj_default = new Object({});
        this.template_default = [
            { type:'raw', detail:'[company.print_line1]',align:'center',underline:true },
            { type:'line' },
            { type:'raw', detail:'It seems that there is some error in parsing the template provided.',align:'center' },
        ];
        if(parseInt(id) == id) this.setFromID(parseInt(id));
        else this.setFromFNCode(id);
        DB.get('epss_app',null,function(PrintTemplate){
            let fetches = ['print_line1','print_line2','print_line3'], company = {};
            this.result.forEach(({ name,detail }) => (fetches.includes(name)) ? company[name] = detail : null);
            PrintTemplate.company(company);
        },PrintTemplate)
    }

    setFromID(id){
        DB.get('printing',id,function(cls){
            cls.setFromDB(this.result);
        },this)
    }

    setFromFNCode(fncode){
        DB.get('printing',{ fncode,status:'Active' },function(cls){
            cls.setFromDB(this.result);
        },this)
    }

    setFromDB(db_array){
        if(!db_array) return;
        let data = (_.isArray(db_array) && !_.isEmpty(db_array)) ? _.last(db_array) : db_array;
        try { this['tObj'] = eval(data.object ? data.object.replace(/\\n/g,String.fromCharCode(10)) : null) || this.tObj_default; } catch (e) { log('Error in setting ThisObject from database table printing of column object'); this['tObj'] = new Object({}); }
        try { this['template'] = eval(data.template ? data.template.replace(/\\n/g,String.fromCharCode(10)) : null) || this.template_default; } catch (e) { log('Error in setting template for print',data.template); this['template'] = this.template_default; }
        [1,2,3].forEach(n => {
            this['tObj']['header' + n] = data['header' + n];
            this['tObj']['footer' + n] = data['footer' + n];
            this['query' + n] = data['query' + n];
            let props = this.getPropsFromDB(data['query' + n + '_props']);
            this['query' + n + '_props'] = props;
            this['tObj']['query' + n] = [];
            props.forEach(prop => this.prop[prop] = null);
        });
        this['tObj']['fncode'] = data['fncode'];
    }

    getPropsFromDB(data){
        if(!data) return [];
        if(data.substr(0,1) === '[' && data.substr(-1) === ']') return eval(data);
        if(data.includes(',')) return data.split(',');
        return [data];
    }

    set(obj){
        for(let x in obj) this[x] = obj[x];
    }

    prepare(){
        let cls = this;
        return new Promise(resolve => {
            Promise.all([1,2,3].map(n => (!this['query' + n + '_result'] && this['query' + n]) ? DB.getAllQueryParams(this['query' + n],this.params(n),function(cls,n){
                    cls['query' + n + '_result'] = this.result;
                    cls['tObj']['query'+n] = this.result;
                },[cls,n]) : Promise.resolve(true)))
                .then(responses => resolve(cls))
        })
    }

    params(n){
        let params = this['query' + n + '_props']; if(!Array.isArray(params)) params = [params].filter(param => param);
        return params.map(param => this.prop[param])
    }

    props(obj){
        if(obj === undefined) return Object.keys(this.prop);
        for(let x in obj) this.prop[x] = obj[x];
        [1,2,3].forEach(n => this['query' + n + '_result'] = null);
        return this;
    }

    print(width){
        if(width) PrintTemplate.set({ width });
        let printData = [];
        this.template.forEach(options => printData.push(PrintTemplate[options.type.toUpperCase()](options,this['tObj'])));
        if(parseInt(PrintTemplate.width) < 40) printData = printData.concat(printer.LF(2));
        doPrint(printData.flat(1));
    }
}

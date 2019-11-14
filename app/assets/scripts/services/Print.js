const PrintTemplate = new (require('./PrintTemplate').PrintTemplate)();

export class Print {
    constructor(id){
        this.prop = []; this.query1_result = null; this.query2_result = null; this.query3_result = null; this.tObj_default = new Object({});
        this.template_default = [
            { type:'raw', detail:'[this.header1]',align:'center' },
            { type:'line', bold:true },
            { type:'raw', detail:'It seems that there is some error in parsing the template provided.',align:'center' },
            { type:'line', bold:true },
            { type:'raw', detail:'[this.footer1]',align:'center' },
        ];
        if(parseInt(id) == id) this.setFromID(parseInt(id));
        else this.setFromFNCode(id)
    }

    setFromID(id){
        DB.get('printing',id,function(cls){
            cls.setFromDB(this.result);
        },this)
    }

    setFromFNCode(fncode){
        DB.get('printing',{ fncode },function(cls){
            cls.setFromDB(this.result);
        },this)
    }

    setFromDB(db_array){
        if(!db_array) return;
        let data = (Array.isArray(db_array) && db_array[0]) ? db_array[0] : db_array;
        try { this['tObj'] = eval(data.object ? data.object.replace(/\\n/g,String.fromCharCode(10)) : null) || this.tObj_default; } catch (e) { log('Error in setting ThisObject from database table printing of column object'); this['tObj'] = new Object({}); }
        try { this['template'] = eval(data.template ? data.template.replace(/\\n/g,String.fromCharCode(10)) : null) || this.template_default; } catch (e) { this['template'] = this.template_default; }
        [1,2,3].forEach(n => {
            this['tObj']['header' + n] = data['header' + n];
            this['tObj']['footer' + n] = data['footer' + n];
            this['query' + n] = data['query' + n];
            let props = data['query' + n + '_props'];
            this['query' + n + '_props'] = props ? eval((props.substr(0,1) === '[') ? props : '["' + props + '"]') : null;
            this['tObj']['query' + n] = [];
        });
        this['tObj']['fncode'] = data['fncode'];
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
        for(let x in obj) this.prop[x] = obj[x];
        return this;
    }

    print(width){
        if(width) PrintTemplate.set({ width });
        let printData = [];
        this.template.forEach(options => printData.push(PrintTemplate[options.type.toUpperCase()](options,this['tObj'])));
        print(printData.flat(1));
    }
}
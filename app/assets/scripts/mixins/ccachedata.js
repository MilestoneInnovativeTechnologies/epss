export const CCacheDataMixin = {

    data(){ return {
        CCacheDataReady: false,
        CCacheDataTimeOut: 0,
    } },
    methods: {
        CCacheDataRefill(table,key,method,args,get){
            clearTimeout(this.CCacheDataTimeOut);
            if(!CCache.hasOwnProperty(table)) return this.CCacheDataTimeOut = setTimeout(this.CCacheDataRefill,500,table,key,method,args,get);
            let data = CCache[table][method](...args);
            this[key] = get ? _.get(data,get) : data;
            this.CCacheDataReady = true;
        },
        CCacheDataPrepare(arg){
            let { method,table,key,args,get } = this.CCacheDataCorrectArg(arg);
            if(!CCache.hasOwnProperty(table)) this.$store.dispatch('redrawModules',table);
            this.CCacheDataRefill(table,key,method,args,get)
        },
        CCacheDataCorrectArg(arg){
            arg = _.isObject(arg) ? arg : { table:arg };
            if(!arg.hasOwnProperty('method')) arg['method'] = 'all';
            if(!arg.hasOwnProperty('key')) arg['key'] = arg['table'];
            if(!arg.hasOwnProperty('args')) arg['args'] = [];
            if(!Array.isArray(arg['args'])) arg['args'] = [arg['args']];
            if(!arg.hasOwnProperty('get')) arg['get'] = null;
            return arg;
        }
    }

};

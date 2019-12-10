export const CCacheDataMixin = {

    data(){ return {
        CCacheDataReady: false,
        CCacheDataTimeOut: 0,
    } },
    methods: {
        CCacheDataRefill(table,key,method,args){
            clearTimeout(this.CCacheDataTimeOut);
            if(!CCache.hasOwnProperty(table)) return this.CCacheDataTimeOut = setTimeout(this.CCacheDataRefill,500,table,key,method,args);
            this[key] = CCache[table][method](...args);
            this.CCacheDataReady = true;
        },
        CCacheDataPrepare(arg){
            let { method,table,key,args } = this.CCacheDataCorrectArg(arg);
            if(!CCache.hasOwnProperty(table)) this.$store.dispatch('redrawModules',table);
            this.CCacheDataRefill(table,key,method,args)
        },
        CCacheDataCorrectArg(arg){
            arg = _.isObject(arg) ? arg : { table:arg };
            if(!arg.hasOwnProperty('method')) arg['method'] = 'all';
            if(!arg.hasOwnProperty('key')) arg['key'] = arg['table'];
            if(!arg.hasOwnProperty('args')) arg['args'] = [];
            if(!Array.isArray(arg['args'])) arg['args'] = [arg['args']];
            return arg;
        }
    }

};
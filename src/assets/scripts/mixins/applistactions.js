export const AppListAction = {
    props: {
        action: { validator:(value) => ['remove','select','pick'].indexOf(value) > -1 },
        selected: { type:null,default:() => [] }
    },
    data(){ return {
        dataCollection: [],
    }},
    methods: {
        listAction(payload) {
            let method = 'listActionExecute' + _.upperFirst(payload.action);
            this.emitAction(payload);
            this[method](payload);
            this.emitCollection();
        },
        listActionExecuteRemove({ row }){ this.dataItems.splice(row,1); },
        listActionExecuteRemoveAll(){
            let title = 'Remove all items', message = "This will remove every items in the list. It's not reversible.";
            confirm({ title,message,okButtonText:'Confirm Removal',cancelButtonText:'Cancel'}).then(result => {
                if(result) { this.dataItems.splice(0); this.emitCollection(); }
            })
        },
        listActionExecutePick({ row }){ this.dataCollection = _.concat(row); },
        listActionExecuteAll(){ if(this.dataCollection.length === this.dataItems.length) this.dataCollection.splice(0); else this.dataCollection = _.range(0,this.dataItems.length); },
        listActionExecuteSelect({ row }){ this.dataCollection = _.xor(this.dataCollection,_.concat(row)); },
        emitCollection(){ this.$emit('collection',_.map(_.pick(this.dataItems,this.dataCollection))); },
        emitAction({ action,row }){ let item = _.isNumber(row) ? _.pick(this.dataItems,row) : null; this.$emit(action,item); }
    },
    mounted(){
        if(this.action === 'remove') this.dataCollection = _.range(0,this.dataItems.length);
        this.emitCollection();
    },
    watch: {
        source(nSrc){ if(this.action === 'remove') this.dataCollection = _.range(0,nSrc.length); this.emitCollection() },
        selected: { immediate:true, handler:function(data){ this.dataCollection = Array.isArray(data) ? data : [data]; this.emitCollection() } }
    }
};
class AppFormData {
    constructor() { console.log('FD Constr'); }
    init(){ this.vFormData = new FormData(); console.log('FD init'); return this; }
    file(data,name){
        console.log('FD File');
        this.vFormData.append('file',new Blob([JSON.stringify(data)],{ type:'application/json' }),[(name || 'table'),'json'].join('.'));
        console.log('FD file after');
        return this;
    }
    params(data){
        console.log('FD params');
        _.forEach(data,(val,fld) => { this.vFormData.append(fld,val); });
        console.log('FD params after');
        return this;
    }
    get(){ console.log('FD get'); return this.vFormData; }
    config(url){
        console.log('FD config');
        return { url,type:'post',enctype:'multipart/form-data',processData:false,contentType:false }
    }
}

export const FD = new AppFormData();
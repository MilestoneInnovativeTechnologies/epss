function getActivityUploadConfig(){ return { url,type:'post',enctype:'multipart/form-data',processData:false,contentType:false } }

class AppFormData {
    constructor() {}
    init(){ this.vFormData = new FormData(); return this; }
    file(data,name){
        this.vFormData.append('file',new Blob([JSON.stringify(data)],{ type:'application/json' }),[(name || 'table'),'json'].join('.'));
        return this;
    }
    params(data){
        _.forEach(data,(val,fld) => { this.vFormData.append(fld,val); });
        return this;
    }
    get(){ return this.vFormData; }
    config(url){
        return { url,type:'post',enctype:'multipart/form-data',processData:false,contentType:false }
    }
}

export const FD = new AppFormData();
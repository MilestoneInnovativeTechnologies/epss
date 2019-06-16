const { knownFolders } = require('tns-core-modules/file-system');

class AppFormData {
    constructor() { this.root = knownFolders.temp().getFolder('activity'); console.log('FD Constructor'); }
    init(data,callback,...args){
        this.vParams = []; this.callback = callback; this.args = args;
        console.log('FD params');
        _.forEach(data,(value,name) => this.vParams.push({ name,value }));
        console.log('FD params after');
        return this;
    }
    file(data,name){
        console.log('FD File');
        name = name || 'table'; let file = this.root.getFile(name + '.json');
        file.writeText(JSON.stringify(data)).then(() => {
            console.log('File write success',file.path);
            this.vParams.push({ name:'file',filename:file.path,mimeType:'application/json' });
            this.callback.apply(this,this.args)
        }).catch((err) => { console.log('File write error',err) });
        console.log('FD file after');
        return this;
    }
    request(url){
        console.log('FD config');
        return { url,method:'POST', headers: { "Content-Type": "application/octet-stream" },description:'Activity Upload' }
    }
}

export const FD = new AppFormData();
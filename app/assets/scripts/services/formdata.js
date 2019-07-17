const { knownFolders } = require('tns-core-modules/file-system');

class AppFormData {
    constructor() { this.root = knownFolders.temp().getFolder('activity'); FDLog('FD Constructor'); }
    init(data,callback,...args){
        this.vParams = []; this.callback = callback; this.args = args;
        _.forEach(data,(value,name) => this.vParams.push({ name,value }));
        return this;
    }
    file(data,name){
        name = name || 'table'; let file = this.root.getFile(name + '.json');
        file.writeText(JSON.stringify(data)).then(() => {
            this.vParams.push({ name:'file',filename:file.path,mimeType:'application/json' });
            this.callback.apply(this,this.args)
        }).catch((err) => { FDLog('File write error',err,file.path) });
        return this;
    }
    request(url){
        sLog('FD config');
        return { url,method:'POST', headers: { "Content-Type": "application/octet-stream" },description:'Activity Upload' }
    }
}

function FDLog(text,...args) {
    if (TNS_ENV === 'production') return;
    console.log('FormData: '+ text,...args);
}

export const FD = new AppFormData();
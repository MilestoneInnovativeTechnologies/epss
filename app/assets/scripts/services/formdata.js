const { knownFolders } = require('tns-core-modules/file-system');

class AppFormData {
    constructor() { this.root = knownFolders.temp().getFolder('activity'); sLog('FD Constructor'); }
    init(data,callback,...args){
        this.vParams = []; this.callback = callback; this.args = args;
        sLog('FD params');
        _.forEach(data,(value,name) => this.vParams.push({ name,value }));
        sLog('FD params after');
        return this;
    }
    file(data,name){
        sLog('FD File');
        name = name || 'table'; let file = this.root.getFile(name + '.json');
        file.writeText(JSON.stringify(data)).then(() => {
            sLog('File write success',file.path);
            this.vParams.push({ name:'file',filename:file.path,mimeType:'application/json' });
            this.callback.apply(this,this.args)
        }).catch((err) => { sLog('File write error',err) });
        sLog('FD file after');
        return this;
    }
    request(url){
        sLog('FD config');
        return { url,method:'POST', headers: { "Content-Type": "application/octet-stream" },description:'Activity Upload' }
    }
}

function sLog(text) {
    if (TNS_ENV === 'production') return;
    console.log('FormData: '+ text);
}

export const FD = new AppFormData();
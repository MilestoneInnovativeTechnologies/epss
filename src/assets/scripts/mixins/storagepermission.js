const permission = require('nativescript-permissions')

export const StoragePermission = {
    methods: {
        StoragePermission(){
            return new Promise((resolve,reject) => {
                if(permission.hasPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)) return resolve(true)
                permission.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE,'Required permission to save file into storage.. Please allow it!')
                    .then(() => resolve(true))
                    .catch(() => {
                        alert('Write permission required to save file into storage.. Aborting operation');
                        resolve(false);
                    })
            })
        },
    }
}
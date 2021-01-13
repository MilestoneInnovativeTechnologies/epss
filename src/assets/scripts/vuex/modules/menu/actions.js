const delay = 5000;
const timer = require('@nativescript/core/timer');

export function setup({ dispatch },menu){
    DB.get('menu').then(records => {
        if(records.length === 0) return timer.setTimeout(dispatch,delay,'setup',menu);
        let updates = {}, kRecords = _.keyBy(records,'fncode'); _.forEach(menu,(Ary,Name) => {
            let fncodes = Ary[2].split(','), component = Ary[0], props = Ary[1], status = Ary[3];
            _.forEach(fncodes,fncode => { updates[fncode] = { component,props,status:(!status || component.trim() === '' || status === 'Inactive') ? 'Inactive' :'Active' } });
        });
        _.forEach(kRecords,({ status },fncode) => {
            let data = updates[fncode];
            data = _.set(data,'status',(status === 'Active' && data.status === 'Active') ? 'Active' : 'Inactive');
            DB.update('menu',{ fncode },data);
        });
    });
}

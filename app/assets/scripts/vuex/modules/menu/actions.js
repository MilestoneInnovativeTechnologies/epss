const delay = 5000;

export function setup({ dispatch },menu){
    let updates = {};
    _.forEach(menu,(Ary,Name) => {
        let fncodes = Ary[2].split(','), component = Ary[0], props = Ary[1], status = Ary[3];
        _.forEach(fncodes,fncode => { updates[fncode] = { component,props,status:(!status || component.trim() === '' || status === 'Inactive') ? 'Inactive' :'Active' } });
    });
    setTimeout(completeMenuSetup,delay,dispatch,updates);
}

function completeMenuSetup(dispatch,updates){
    DB.get('menu').then(records => records.length ? doUpdateMenus(dispatch,updates) : setTimeout(completeMenuSetup,delay,dispatch,updates))
}
function doUpdateMenus(dispatch,updates) {
    let table = 'menu', upload = false; _.forEach(updates,(data,fncode) => {
        dispatch('_update',{ table,data,condition:{ fncode },upload },{ root:true });
    });
}
import {add_setup_menu_data} from "../../mutation-types";

export function setup({ commit },menu){
    _.forEach(menu,(Ary,Name) => {
        let fncodes = Ary[2].split(','), component = Ary[0], props = Ary[1], status = Ary[3];
        let data = _.map(fncodes,(fncode) => { return { fncode,component,props,status } });
        commit(add_setup_menu_data,data);
    })
}

export function distribute({ state,dispatch }){
    if(!state.sMenuData.length) return;
    _.forEach(state.sMenuData, ({ fncode,component,props,status }) => {
        let condition = { fncode }, table = 'menu', data = { component,props }; if(!status || component.trim() === '') data.status = 'Inactive';
        dispatch('_update',{ table,data,condition,upload:false },{ root:true });
    })
}
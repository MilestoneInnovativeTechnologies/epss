export function addNew({ state,dispatch },cusObj){
    let data = _.pick(cusObj,state.newUserFields), area = cusObj.area;
    data['outstanding'] = 0; data['overdue'] = 0;
    return new Promise(resolve => {
        dispatch('_insert',{ table:'users',data },{ root:true }).then(activity => {
            let user = activity.data[0].id, data = { area,user };
            dispatch('_insert',{ table:'area_users',data },{ root:true }).then(() => resolve(user));
        });
    });
}

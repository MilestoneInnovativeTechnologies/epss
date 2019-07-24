export function addNew({ state,dispatch },cusObj){
    let data = _.pick(cusObj,state.newUserFields);
    return new Promise((resolve, reject) => {
        dispatch('_insert',{ table:'users'
            ,data,vm:this
            ,success:(user) => dispatch('_insert',{ table:'area_users',data:{ area:cusObj.area,user},success:() => resolve(user) },{ root:true })
        },{ root:true })
    });
}

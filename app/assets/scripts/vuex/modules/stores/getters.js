export function stores({ _data },{ ms,so }) {
    let mine = _.pick(so,ms); console.log(ms,so,mine);
    return _.values(mine);
}
export function so({ _data }) {
    return _(_data.stores).keyBy('id').mapValues('name').value();
}
export function as({ _data }) {
    return _.map(_data.stores,'id');
}
export function ms({ _data }) {
    return _.map(_data.user_store_area,'store');
}

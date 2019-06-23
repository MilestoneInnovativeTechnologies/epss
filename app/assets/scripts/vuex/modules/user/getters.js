export function credentials({ email,password }) {
    return { email,password };
}
export function user_store_areas({ id },{ _tableDataFilter }) {
    return _tableDataFilter('user_store_area','user',id);
}
export function stores({ stores }) {
    return _.map(stores,'id');
}
export function areas({ areas }) {
    return _.map(areas,'id');
}
export function customers({ customers }) {
    return _.map(customers,'id');
}


export function stores(state) {
    let stores = _(state._data.stores).keyBy('id').mapValues('name').value();
    return _.values(_.pick(stores,_.map(state._data.user_store_area,'store')));
}

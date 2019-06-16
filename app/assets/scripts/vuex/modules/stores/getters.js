export function stores(state) {
    console.log('store getter called');
    let stores = _(state._data.stores).keyBy('id').mapValues('name').value();
    console.log('store getter stores',stores);
    return _.values(_.pick(stores,_.map(state._data.user_store_area,'store')));
}

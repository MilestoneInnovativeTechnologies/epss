export function areas(state) {
    let areas = _(state._data.areas).keyBy('id').mapValues('name').value();
    return _.values(_.pick(areas,_.map(state._data.user_store_area,'area')));
}

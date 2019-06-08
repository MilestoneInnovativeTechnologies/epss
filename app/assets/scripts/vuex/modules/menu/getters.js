export function sections(state) { return _.keys(state.category).length; }
export function menus(state) { return _.mapValues(state.category,(Ary) => _.map(Ary,(item) => state.items[item]) ); }


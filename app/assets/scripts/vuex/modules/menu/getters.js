export function sections(state) { return _.keys(state.category).length; }
export function menus(state) { return _.mapValues(state.category,(Ary) => _.map(Ary,(item) => state.items[item]) ); }
/*
* For conditional menu items
* In getters there should be a function named CN_<category_name> and it must return true or false to make that category available for the app.
* All the items in the conditional category would be displayed except there should be a function in the name
* CN_<category_name>_<item_index_in_category> ex: CN_SHIFT_2
* and that function must return boolean true
* */
export function conditional({ conditional },getters) { return conditional.filter(category => getters['CN_'+category]) }
export function conditional_items({ conditional,conditional_items },getters) { return getters.conditional.map(category => conditional_items[conditional.indexOf(category)].filter((c_item,idx) => !_.has(getters,'CN_'+category+'_'+idx) || getters['CN_'+category+'_'+idx])) }
export function CN_SHIFT() { return __.SHIFTMANAGEMENT === 'Yes' }


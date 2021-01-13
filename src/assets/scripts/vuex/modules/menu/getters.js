export function sections(state) { return _.keys(state.category).length; }
export function menus(state) { return _.mapValues(state.category,(Ary) => _.map(Ary,(item) => state.items[item]) ); }
/*
* For conditional menu items
* In getters there should be a function named CN_<category_name> and it must return true or false to make that category available for the app.
* All the items in the conditional category would be displayed except there should be a function in the name
* CN_<category_name>_<item_index_in_category> ex: CN_SHIFT_0
* and that function must return boolean true
* or the object with menu section properties ex: { icon:'create_new_folder',home_display:'Create',drawer_display:'Create Shift',component:'ShiftIndex',props:'store,fycode,fncode',fncode:'SHF' }
* if returning boolean true, item properties from state will be returned
* */
export function conditional({ conditional },getters) { return conditional.filter(category => getters['CN_'+e(category)]) }
export function conditional_items({ conditional,conditional_items },getters) {
    return getters.conditional.map(category => conditional_items[conditional.indexOf(category)].map((c_item,idx) => {
        if(!_.has(getters,'CN_'+e(category)+'_'+idx)) return c_item;
        let getterStatus = getters['CN_'+e(category)+'_'+idx];
        if(_.isBoolean(getterStatus)) return getterStatus ? c_item : false;
        return getterStatus;
    }).filter(a => a))
}
export function CN_RECEIPT() { return true }
export function CN_RECEIPT_0({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','CR1']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'CR1'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_RECEIPT_1({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','BR1']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'BR1'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_RECEIPT_2({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','BR2']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'BR2'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_MATERIAL_TRANSFER() { return true }
export function CN_MATERIAL_TRANSFER_0({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','MT1']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'MT1'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_MATERIAL_TRANSFER_1({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','MT2']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'MT2'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_SALES_ORDER() { return true }
export function CN_SALES_ORDER_0({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','SO1']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'SO1'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_SALES_ORDER_1({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','SO2']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'SO2'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_SALES_ORDER_2({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','SO3']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'SO3'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_SALES() { return true }
export function CN_SALES_0({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','SL1']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'SL1'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_SALES_1({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','SL2']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'SL2'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_SALES_2({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','SL3']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'SL3'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_SALES_3({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','SL4']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'SL4'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_SALES_4({ dbData:{ menu } },getters,{ Reserves:{ dbData:{ fn_reserves } },default_store }) { let props = _.find(menu,['fncode','SL5']), reserve = _.find(fn_reserves,({ store,fncode }) => parseInt(store) === parseInt(default_store) && fncode === 'SL5'); if(props && reserve && props.status === 'Active') return props; return false; }
export function CN_SHIFT() { return __.SHIFTMANAGEMENT === 'Yes' }

function e(t){ return t.replace(/\s/g,'_') }
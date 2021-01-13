import {get_all_active_menu_in_order} from "../../../queries";

export default {
    dbTables: ['menu'],
    dbQuery: { menu: get_all_active_menu_in_order },
    dbData: { menu:[] },
    avoid: { fncode:['SL1','SL2','SL3','SL4','SL5','BR1','CR1','BR2','MT1','MT2','SO1','SO2','SO3'] },
    content: null,
    sections: [],
    section_items: [],
    commons: ['USER','MISC'],
    common_items: [
        [
            { icon:'people',home_display:'Customers',drawer_display:'Customers',component:'CustomersIndex',props:'',fncode:'' },
            { icon:'widgets',home_display:'Products',drawer_display:'Products',component:'ProductsIndex',props:'',fncode:'' },
            { icon:'store',home_display:'Stores & Areas',drawer_display:'Stores & Areas',component:'StoresIndex',props:'',fncode:'' },
        ],[
            { icon:'settings',home_display:'Settings',drawer_display:'Settings',component:'SettingsIndex',props:'',fncode:'' },
            { icon:'assignment',home_display:'Reserves',drawer_display:'Function Reserves',component:'ReservesIndex',props:'store',fncode:'' },
        ]
    ],
    conditional: ['RECEIPT','MATERIAL TRANSFER','SALES ORDER','SALES','SHIFT'],
    conditional_items: [
        [true,true,true],
        [true,true],
        [true,true,true],
        [true,true,true,true,true],
        [
            { icon:'create_new_folder',home_display:'Create',drawer_display:'Create Shift',component:'ShiftIndex',props:'store,fycode,fncode',fncode:'SHF' },
            { icon:'all_out',home_display:'Shift',drawer_display:'Shift Details',component:'ShiftIndex',props:'store,fycode,fncode',fncode:'SDRP' },
        ]
    ],
    drawerActiveStatus: false,
}

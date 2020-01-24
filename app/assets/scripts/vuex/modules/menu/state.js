export default {
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
    conditional: ['SHIFT'],
    conditional_items: [
        [
            { icon:'control_point_duplicate',home_display:'Create',drawer_display:'Create Shift',component:'ShiftCreate',props:'',fncode:'' },
            { icon:'all_out',home_display:'Status',drawer_display:'Shift Status',component:'ShiftStatus',props:'',fncode:'' },
            { icon:'blur_off',home_display:'Close',drawer_display:'Close Shift',component:'ShiftClose',props:'',fncode:'' },
        ]
    ],
    drawerActiveStatus: false,
}

export default {
    sMenuData: [],
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
        ]
    ],
    drawerActiveStatus: false,
}

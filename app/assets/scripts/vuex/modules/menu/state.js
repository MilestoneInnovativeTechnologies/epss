export default {
    sMenuData: [],
    content: null,
    sections: [],
    section_items: [],

    items: {
        sales:['SALES','local_grocery_store','pages/sales/SalesIndex','Sales'],
        sales_return:['RETURN','call_missed','pages/sales/SalesReturnIndex','Sales Return'],
        sales_order:['ORDER','description','pages/sales/SalesOrderIndex','Sales Order'],
        cash_receipt:['CASH','attach_money','pages/receipt/CashReceiptIndex','Cash Receipt'],
        cheque_receipt:['CHEQUE','chrome_reader_mode','pages/receipt/ChequeReceiptIndex','Cheque Receipt'],
        stock_load:['LOAD','add','pages/stock/StockLoadIndex','Stock Load'],
        stock_unload:['UNLOAD','clear','pages/stock/StockUnloadIndex','Stock Unload'],
        customers:['CUSTOMER','contacts','pages/customer/CustomerIndex','Customers'],
        stores:['STORES','store','pages/store/StoreIndex','Stores'],
        profile:['PROFILE','transfer_within_a_station','pages/profile/ProfileIndex','Profile'],
        settings:['SETTINGS','settings','pages/settings/SettingsIndex','Settings'],
    },
    category: {
        'SALES':['sales','sales_return','sales_order'],
        'RECEIPT': ['cash_receipt','cheque_receipt'],
        'STOCK': ['stock_load','stock_unload'],
        'USER': ['customers','stores','profile','settings'],
    },
    drawerActiveStatus: false,
}

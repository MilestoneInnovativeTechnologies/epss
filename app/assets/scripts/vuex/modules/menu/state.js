export default {
    items:{
        sales:['SALES','local_grocery_store','pages/sales/SalesIndex'],
        sales_return:['RETURN','call_missed','pages/sales/SalesReturnIndex'],
        sales_order:['ORDER','description','pages/sales/SalesOrderIndex'],
        cash_receipt:['CASH','attach_money','pages/receipt/CashReceiptIndex'],
        cheque_receipt:['CHEQUE','chrome_reader_mode','pages/receipt/ChequeReceiptIndex'],
        stock_load:['LOAD','add','pages/stock/StockLoadIndex'],
        stock_unload:['UNLOAD','clear','pages/stock/StockUnloadIndex'],
        customers:['CUSTOMER','contacts','pages/customer/CustomerIndex'],
        stores:['STORES','store','pages/store/StoreIndex'],
        profile:['PROFILE','transfer_within_a_station','pages/profile/ProfileIndex'],
        settings:['SETTINGS','settings','pages/settings/SettingsIndex'],
    },
    category: {
        'SALES':['sales','sales_return','sales_order'],
        'RECEIPT': ['cash_receipt','cheque_receipt'],
        'STOCK': ['stock_load','stock_unload'],
        'USER': ['customers','stores','profile','settings'],
    }
}

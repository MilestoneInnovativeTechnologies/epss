export default {
    items:{
        sales:['SALES','local_grocery_store'],
        sales_return:['RETURN','call_missed'],
        sales_order:['ORDER','description'],
        cash_receipt:['CASH','attach_money'],
        cheque_receipt:['CHEQUE','chrome_reader_mode'],
        stock_load:['LOAD','add'],
        stock_unload:['UNLOAD','clear'],
        customers:['CUSTOMER','contacts'],
        stores:['STORES','store'],
        profile:['PROFILE','transfer_within_a_station'],
        settings:['SETTINGS','settings'],
    },
    category: {
        'SALES':['sales','sales_return','sales_order'],
        'RECEIPT': ['cash_receipt','cheque_receipt'],
        'STOCK': ['stock_load','stock_unload'],
        'USER': ['customers','stores','profile','settings'],
    }
}

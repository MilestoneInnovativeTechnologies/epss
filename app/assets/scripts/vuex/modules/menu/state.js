export default {
    items:{
        sales:['SALES','fa-cubes'],
        sales_return:['RETURN','fa-clone'],
        sales_order:['ORDER','fa-sticky-note-o'],
        cash_receipt:['CASH','fa-money'],
        cheque_receipt:['CHEQUE','fa-pencil-square-o'],
        stock_load:['LOAD','fa-cloud-download'],
        stock_unload:['UNLOAD','fa-cloud-upload'],
        customers:['CUSTOMER','fa-users'],
        stores:['STORES','fa-building'],
        profile:['PROFILE','fa-user-circle-o'],
        settings:['SETTINGS','fa-cogs'],
    },
    category: {
        'SALES':['sales','sales_return','sales_order'],
        'RECEIPT': ['cash_receipt','cheque_receipt'],
        'STOCK': ['stock_load','stock_unload'],
        'USER': ['customers','stores','profile','settings'],
    }
}

export const user_assigned_stores = `SELECT * FROM stores WHERE EXISTS (SELECT * FROM user_store_area WHERE user_store_area.store = stores.id AND user_store_area.user = ?)`;
export const user_assigned_store_areas = `SELECT * FROM areas WHERE EXISTS(SELECT * FROM user_store_area WHERE user_store_area.area = areas.id AND user_store_area.user = ?)`;
export const user_assigned_area_customers = `SELECT * FROM users WHERE EXISTS ( SELECT * FROM area_users WHERE area_users.user = users.id AND EXISTS( SELECT * FROM user_store_area WHERE user_store_area.area = area_users.area AND EXISTS( SELECT * FROM users WHERE users.id = user_store_area.user AND users.id = ? ) ) )`;
export const user_assigned_customer_sales_orders = `SELECT sales_order.*,sales_order._ref id,customer.name customer,customer.id cid,executive.name executive,executive.id eid FROM sales_order,users customer,users executive WHERE progress <> 'Completed' AND sales_order.customer = customer.id AND sales_order.user = executive.id AND EXISTS(SELECT * FROM area_users WHERE area_users.user = sales_order.customer AND EXISTS(SELECT * FROM user_store_area WHERE user_store_area.area = area_users.area AND user_store_area.user = ? ))`;
export const sales_order_items_of_a_sales_order = `SELECT SOI.product pid,SOI.rate,SOI.quantity,SOI.tax,SOI.discount,SOI.total,SOI._ref,P.name AS product FROM sales_order_items SOI,products P WHERE SOI.product = P.id AND SOI.so = ?`
export const fetch_fiscal_year_details = `SELECT * FROM fiscalyearmaster`;
export const fetch_all_products = `SELECT P.id, P.name, P.uom, P.narration, G1.name category, G2.name brand, G1.tax1 'tax', PL.price FROM products P LEFT JOIN productgroups G1 ON G1.id = P.group1 LEFT JOIN productgroups G2 ON G2.id = P.group2 LEFT JOIN pricelist PL ON PL.product = P.id WHERE G1.id = P.group1`;
export const fetch_all_transaction_natures = `SELECT * FROM product_transaction_natures`;
export const fetch_total_sale_details_of_a_period = `SELECT SUM(TD.\`total\`) total FROM transactions T, transaction_details TD WHERE TD.\`transaction\` = T._ref AND T.fncode LIKE 'SL%' AND T.user = ? AND datetime(T.date) >= ?`;
export const fetch_total_sale_returns_of_a_period = `SELECT SUM(TD.\`total\`) total FROM transactions T, transaction_details TD WHERE TD.\`transaction\` = T._ref AND T.fncode LIKE 'SR%' AND T.user = ? AND datetime(T.date) >= ?`;
export const customer_recent_sales_count_for_return = `SELECT T.\`customer\` cid, COUNT(T.\`fncode\`) salesCount ,C.\`name\` customer, MAX(datetime(T.\`date\`)) lastSaleDate FROM transactions T,users C WHERE T.\`customer\` = C.\`id\` AND fncode like 'SL%' GROUP BY T.\`customer\``;
export const fetch_all_active_receipts = `SELECT R._ref id, R.docno, R.mode, R.customer cid, C.name customer, R.user eid, E.name executive, R.date, R.amount, R.bank, R.cheque, R.cheque_date FROM receipts R,users C,users E WHERE R.customer = C.id AND R.user = E.id AND R.status = 'Active' ORDER BY datetime(R.date) DESC`;
export const fetch_all_pending_transfer_outs = `SELECT DISTINCT ST.\`out\` id,T.\`docno\`,T.\`date\`,SPT.\`store\` sid,S.\`name\` store FROM stock_transfer ST, transactions T, transaction_details TD, store_product_transactions SPT, stores S WHERE ST.\`in\` IS NULL AND ST.\`out\` = T.\`_ref\` AND T.\`_ref\` = TD.\`transaction\` AND TD.\`spt\` = SPT.\`_ref\` AND SPT.\`store\` = S.\`id\``;
export const fetch_current_stock_list_of_a_store = `SELECT TR.product id,PR.name product,SUM(CASE WHEN TR.direction = 'In' THEN TR.quantity ELSE 0 END) 'in',SUM(CASE WHEN TR.direction = 'Out' THEN TR.quantity ELSE 0 END) 'out', (SUM(CASE WHEN TR.direction = 'In' THEN TR.quantity ELSE 0 END)-SUM(CASE WHEN TR.direction = 'Out' THEN TR.quantity ELSE 0 END)) stock FROM store_product_transactions TR,products PR WHERE TR.product = PR.id AND TR.store = ? GROUP BY TR.product`;
export const get_product_details_of_transaction = `SELECT TD.\`amount\`,TD.\`tax\`,TD.\`discount\`,TD.\`total\`,SPT.\`product\` pid, P.\`name\` product, SPT.\`quantity\` from transaction_details TD, store_product_transactions SPT, products P WHERE TD.\`spt\` = SPT.\`_ref\` AND SPT.\`product\` = P.\`id\` AND TD.\`transaction\` = ?`;

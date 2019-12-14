export const user_assigned_stores = `SELECT * FROM stores WHERE EXISTS (SELECT * FROM user_store_area WHERE user_store_area.store = stores.id AND user_store_area.user = ?)`;
export const user_assigned_store_areas = `SELECT * FROM areas WHERE EXISTS(SELECT * FROM user_store_area WHERE user_store_area.area = areas.id AND user_store_area.user = ?)`;
export const user_assigned_area_customers = `SELECT * FROM users WHERE EXISTS ( SELECT * FROM area_users WHERE area_users.user = users.id AND EXISTS( SELECT * FROM user_store_area WHERE user_store_area.area = area_users.area AND EXISTS( SELECT * FROM users WHERE users.id = user_store_area.user AND users.id = ? ) ) )`;
export const user_assigned_customer_sales_orders = `SELECT sales_order.*,sales_order._ref id,customer.name customer,customer.id cid,executive.name executive,executive.id eid FROM sales_order,users customer,users executive WHERE progress <> 'Completed' AND sales_order.customer = customer.id AND sales_order.user = executive.id AND EXISTS(SELECT * FROM area_users WHERE area_users.user = sales_order.customer AND EXISTS(SELECT * FROM user_store_area WHERE user_store_area.area = area_users.area AND user_store_area.user = ? ))`;
export const sales_order_items_of_a_sales_order = `SELECT SOI.product pid,SOI.rate,SOI.quantity,SOI.tax,SOI.discount,SOI.total,SOI._ref,P.name AS product FROM sales_order_items SOI,products P WHERE SOI.product = P.id AND SOI.so = ?`
export const fetch_fiscal_year_details = `SELECT * FROM fiscalyearmaster`;
export const fetch_all_products = `SELECT P.id, P.name, P.code, P.uom, P.narration, P.taxcode01, P.taxfactor01, P.subtaxfactor01, P.taxcode02, P.taxfactor02, P.subtaxfactor02, PL.price FROM products P, pricelist PL WHERE PL.product = P.id AND PL.pricelist = 1`;
export const fetch_total_sale_details_of_a_period = `SELECT SUM(TD.\`total\`) total FROM transactions T, transaction_details TD WHERE TD.\`transaction\` = T._ref AND T.fncode LIKE 'SL%' AND T.user = ? AND datetime(T.date) >= ?`;
export const fetch_total_sale_returns_of_a_period = `SELECT SUM(TD.\`total\`) total FROM transactions T, transaction_details TD WHERE TD.\`transaction\` = T._ref AND T.fncode LIKE 'SR%' AND T.user = ? AND datetime(T.date) >= ?`;
export const customer_recent_sales_count_for_return = `SELECT T.\`customer\` cid, COUNT(T.\`fncode\`) salesCount ,C.\`name\` customer, MAX(datetime(T.\`date\`)) lastSaleDate FROM transactions T,users C WHERE T.\`customer\` = C.\`id\` AND fncode like 'SL%' GROUP BY T.\`customer\``;
export const fetch_all_active_receipts = `SELECT R._ref id, R.docno, R.mode, R.customer cid, C.name customer, R.user eid, E.name executive, R.date, R.amount, R.bank, R.cheque, R.cheque_date FROM receipts R,users C,users E WHERE R.customer = C.id AND R.user = E.id AND R.status = 'Active' ORDER BY datetime(R.date) DESC`;
export const get_product_details_of_transaction = `SELECT TD.\`amount\`,TD.\`tax\`,TD.\`discount\`,TD.\`total\`,SPT.\`product\` pid, P.\`name\` product, SPT.\`quantity\` from transaction_details TD, store_product_transactions SPT, products P WHERE TD.\`spt\` = SPT.\`_ref\` AND SPT.\`product\` = P.\`id\` AND TD.\`transaction\` = ?`;
export const customer_pending_sales_order_summary = `SELECT \`SO\`.\`_ref\`,\`SO\`.\`docno\`,\`SO\`.\`date\`,\`SO\`.\`progress\` FROM sales_order SO WHERE \`SO\`.\`progress\` != 'Completed' AND \`SO\`.\`customer\` = ?`;
export const get_all_se_login = `SELECT \`login\` FROM \`users\` WHERE \`login\` IS NOT NULL AND \`code\` LIKE 'SE%'`;


export const get_all_active_menu_in_order = `SELECT * FROM menu WHERE \`status\` = 'Active' ORDER BY CAST(\`order\` as int) ASC`;
export const fetch_recent_receipts = `SELECT R._ref id, R.docno, R.customer cid, C.name customer, R.user eid, E.name executive, R.date, R.amount, R.bank, R.cheque, R.cheque_date FROM receipts R,users C,users E WHERE R.customer = C.id AND R.user = E.id AND R.status = 'Active' AND R.fycode = ? AND R.store = ? AND R.fncode = ? ORDER BY datetime(R.DATE) DESC LIMIT 0,?`;
export const fetch_recent_sales_order = `SELECT SO._ref id, SO.store sid, S.name store, SO.fycode, SO.fncode, SO.docno, SO.customer cid, C.name customer, SO.user eid, E.name executive, SO.date FROM sales_order SO, users C, users E, stores S WHERE SO.store = ? AND SO.fycode = ? AND SO.fncode = ? AND SO.user = E.id AND SO.customer = C.id AND SO.store = S.id AND SO.status = 'Active' ORDER BY datetime(SO.\`date\`) DESC LIMIT 0,?`;
export const fetch_all_pending_transfer_outs = `SELECT DISTINCT ST.\`out\` id,T.\`docno\`,T.\`date\`,T.\`store\` sid,S.\`name\` store FROM stock_transfer ST, transactions T, stores S WHERE ST.\`in\` IS NULL AND ST.\`out\` = T.\`_ref\` AND T.\`store\` = S.\`id\` AND T.\`status\` = 'Active' AND T.\`store\` = ? AND T.\`fycode\` = ? ORDER BY datetime(T.\`date\`) DESC`;
export const fetch_all_recent_transfer_outs = `select T.\`_ref\` id,T.\`docno\`,T.\`date\`,CASE IFNULL(ST.\`in\`,"PENDING") WHEN "PENDING" THEN "PENDING" ELSE "COMPLETED" END 'status' FROM transactions T,stock_transfer ST WHERE ST.\`out\` = T.\`_ref\` AND T.\`store\` = ? AND T.\`fycode\` = ? AND T.\`fncode\` = ? ORDER BY datetime(T.\`date\`) DESC`;
export const fetch_current_stock_list_of_a_store = `SELECT TD.product,TD.product id,PR.id pid,PR.name,PR.narration,SUM(CASE WHEN TD.direction = 'In' THEN TD.quantity ELSE 0 END) 'in',SUM(CASE WHEN TD.direction = 'Out' THEN TD.quantity ELSE 0 END) 'out', (SUM(CASE WHEN TD.direction = 'In' THEN TD.quantity ELSE 0 END)-SUM(CASE WHEN TD.direction = 'Out' THEN TD.quantity ELSE 0 END)) stock, (SUM(CASE WHEN TD.direction = 'In' THEN TD.quantity ELSE 0 END)-SUM(CASE WHEN TD.direction = 'Out' THEN TD.quantity ELSE 0 END)) quantity FROM transaction_details TD,products PR WHERE TD.product = PR.id AND TD.store = ? GROUP BY TD.product`;
export const fetch_product_list_for_advance_transaction = `SELECT product,g01,g02 FROM product_groups`;
export const fetch_product_group_for_advance_transaction = `SELECT id,name,code,list FROM product_group_master`;
export const recent_sale_transactions = `SELECT _ref id, (CASE WHEN customer IS NULL THEN 'CASH SALE' ELSE C.\`name\` END) customer, \`date\`, docno FROM transactions T LEFT JOIN users C ON C.id = T.customer WHERE store = ? AND fycode = ? AND fncode = ? ORDER BY \`date\` DESC LIMIT 0,?`;

export const login_user_area_customers = `SELECT * FROM users WHERE EXISTS ( SELECT * FROM area_users WHERE area_users.user = users.id AND EXISTS( SELECT * FROM user_store_area WHERE user_store_area.area = area_users.area AND EXISTS( SELECT * FROM users WHERE users.id = user_store_area.user AND users.id = (SELECT detail FROM epss_user WHERE name = 'id' LIMIT 1) ) ) )`;
export const login_user_customer_sales_orders = `SELECT sales_order.*,sales_order._ref id,customer.name customer,customer.id cid,executive.name executive,executive.id eid,prd.id product_id,prd.name product,prd.narration product_narration,rate,quantity,taxrule,tax,discount01,discount02 FROM sales_order,users customer,users executive,sales_order_items soi,products prd WHERE progress <> 'Completed' AND sales_order.customer = customer.id AND sales_order.user = executive.id AND sales_order._ref = soi.so AND soi.product = prd.id AND EXISTS(SELECT * FROM area_users WHERE area_users.user = sales_order.customer AND EXISTS(SELECT * FROM user_store_area WHERE user_store_area.area = area_users.area AND user_store_area.user = (SELECT detail FROM epss_user WHERE name = 'id' LIMIT 1) ))`;
export const login_user_recent_receipts = `SELECT R._ref id, R.docno, R.fycode, R.fncode, S.id sid, S.name store, R.customer cid, C.name customer, R.user eid, E.name executive, R.date, R.amount, R.bank, R.cheque, R.cheque_date FROM receipts R,users C,users E,stores S WHERE R.customer = C.id AND R.user = E.id AND R.store = S.id AND R.status = 'Active' AND EXISTS(SELECT * FROM area_users WHERE area_users.user = R.customer AND EXISTS(SELECT * FROM user_store_area WHERE user_store_area.area = area_users.area AND user_store_area.user = (SELECT detail FROM epss_user WHERE name = 'id' LIMIT 1) )) ORDER BY datetime(R.date) DESC LIMIT 0,100`;
export const login_user_stores_recent_sales = `SELECT _ref id, (CASE WHEN customer IS NULL THEN 'CASH CUSTOMER' ELSE C.'name' END) customer, T.customer cid, T.'date', T.docno, T.fycode, T.fncode, T.payment_type, E.id eid, E.name executive, S.id sid, S.name store, P.id pid, P.name product, P.narration product_narration, TD.direction, TD.quantity, TD.rate, TD.taxrule, TD.tax, TD.discount01, TD.discount02 FROM transactions T LEFT JOIN users C ON C.id = T.customer LEFT JOIN users E ON E.id = T.user LEFT JOIN stores S ON S.id = T.store LEFT JOIN transaction_details TD ON TD.'transaction' = T._ref LEFT JOIN products P ON P.id = TD.product WHERE T.'status' = 'Active' AND EXISTS(SELECT * FROM user_store_area WHERE user_store_area.store = T.store AND user_store_area.user = (SELECT detail FROM epss_user WHERE name = 'id' LIMIT 1)) ORDER BY datetime(T.'date') DESC LIMIT 0,300`;
export const login_user_customer_recent_sales_orders = `SELECT T._ref id, C.id cid, C.name customer, T.'date', T.docno, T.fycode, T.fncode, T.payment_type, E.id eid, E.name executive, S.id sid, S.name store, P.id pid, P.name product, P.narration product_narration, TD.quantity, TD.rate, TD.taxrule, TD.tax, TD.discount01, TD.discount02 FROM sales_order T LEFT JOIN users C ON C.id = T.customer LEFT JOIN users E ON E.id = T.user LEFT JOIN stores S ON S.id = T.store LEFT JOIN sales_order_items TD ON TD.so = T._ref LEFT JOIN products P ON P.id = TD.product WHERE T.'status' = 'Active' AND EXISTS(SELECT * FROM area_users WHERE area_users.user = T.customer AND EXISTS(SELECT * FROM user_store_area WHERE user_store_area.area = area_users.area AND user_store_area.user = (SELECT detail FROM epss_user WHERE name = 'id' LIMIT 1) )) ORDER BY datetime(T.'date') DESC LIMIT 0,300`;

export const get_product_stock = `SELECT SUM(CASE WHEN direction = 'In' THEN quantity ELSE 0 END) - SUM(CASE WHEN direction = 'Out' THEN quantity ELSE 0 END) 'stock' FROM transaction_details WHERE product = ?`;

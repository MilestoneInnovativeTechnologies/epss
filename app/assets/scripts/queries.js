export const user_assigned_stores = `SELECT * FROM stores WHERE EXISTS (SELECT * FROM user_store_area WHERE user_store_area.store = stores.id AND user_store_area.user = ?)`;
export const user_assigned_store_areas = `SELECT * FROM areas WHERE EXISTS(SELECT * FROM user_store_area WHERE user_store_area.area = areas.id AND user_store_area.user = ?)`;
export const user_assigned_area_customers = `SELECT * FROM users WHERE EXISTS ( SELECT * FROM area_users WHERE area_users.user = users.id AND EXISTS( SELECT * FROM user_store_area WHERE user_store_area.area = area_users.area AND EXISTS( SELECT * FROM users WHERE users.id = user_store_area.user AND users.id = ? ) ) )`;
export const user_assigned_customer_sales_orders = `SELECT sales_order.*,sales_order._ref id,customer.name customer,customer.id cid FROM sales_order,users customer WHERE progress <> 'Completed' AND sales_order.customer = customer.id AND EXISTS(SELECT * FROM area_users WHERE area_users.user = sales_order.customer AND EXISTS(SELECT * FROM user_store_area WHERE user_store_area.area = area_users.area AND user_store_area.user = ? ))`;
export const sales_order_items_of_a_sales_order = `SELECT SOI.product pid,SOI.rate,SOI.quantity,SOI._ref,P.name AS product FROM sales_order_items SOI,products P WHERE SOI.product = P.id AND SOI.so = ?`
export const fetch_fiscal_year_details = `SELECT * FROM fiscalyearmaster`;
export const fetch_all_products = `SELECT P.id, P.name, P.uom, P.narration, G1.name category, G2.name brand, G1.tax1 'tax', PL.price FROM products P LEFT JOIN productgroups G1 ON G1.id = P.group1 LEFT JOIN productgroups G2 ON G2.id = P.group2 LEFT JOIN pricelist PL ON PL.product = P.id WHERE G1.id = P.group1`;
export const fetch_all_transaction_natures = `SELECT * FROM product_transaction_natures`;
export const fetch_total_sale_details_of_a_period = `SELECT SUM(TD.\`total\`) total FROM transactions T, transaction_details TD WHERE TD.\`transaction\` = T._ref AND T.fncode LIKE 'SL%' AND T.user = ? AND datetime(T.date) >= ?`;

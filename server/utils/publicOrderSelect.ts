export const PUBLIC_ORDER_SELECT = 'id, order_code, status, payment_status, payment_method, currency, ' +
  'customer_name, customer_phone, customer_address, customer_pincode, confirmed_by_customer, ' +
  'receipt_uploaded, created_at, order_items(item_name, variant_label, quantity, unit_price, currency), ' +
  'store:stores(name, upi_vpa, cod_enabled, require_receipt_upload)'

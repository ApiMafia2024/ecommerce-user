export interface OrderItem {
  price: string;
  quantity: number;
  name: string;
}

/** Delivery/shipping address for an order (API may return as delivery_address or shipping_address) */
export interface OrderDeliveryAddress {
  country?: string;
  state?: string;
  city?: string;
  street_address?: string;
  google_map_url?: string;
}

export interface Order {
  id: number;
  amount: number;
  order_info: string;
  status: string;
  items: OrderItem[];
  /** ISO date string when order was placed */
  placed_at?: string;
  /** e.g. "standard", "Standard Purchase" */
  purchase_type?: string;
  /** e.g. "paid", "Paid Successfully" */
  payment_status?: string;
  /** e.g. "shipped", "Shipped" – if absent, main status is used for display */
  delivery_status?: string;
  /** Delivery/shipping address – section hidden when absent */
  delivery_address?: OrderDeliveryAddress;
  /** Alternative API field name for address */
  shipping_address?: OrderDeliveryAddress;
}

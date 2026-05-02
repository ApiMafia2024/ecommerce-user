import { Variation } from "./product.types";

export interface CartItem {
  id: number;
  quantity: number;
  price: number;
  discount: number;
  new_price: number;
  subtotal: number;
  variation: Variation;
}



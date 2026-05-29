import type { DishResponse } from "../../inventory/types";

export interface CartItem {
  dish: DishResponse;
  quantity: number;
  date: string;
}

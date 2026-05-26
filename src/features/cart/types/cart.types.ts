import type { DailyMenuResponse } from "../../daily-menu/types";
import type { DishResponse } from "../../inventory/types";

export interface CartDishItem {
  type: "dish";
  dish: DishResponse;
  quantity: number;
  date: string;
}

export interface CartMenuItem {
  type: "menu";
  menu: DailyMenuResponse;
  price: number;
  quantity: number;
}

export type CartItem = CartDishItem | CartMenuItem;

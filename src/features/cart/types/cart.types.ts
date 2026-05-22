import type { DishResponse, DailyMenuResponse } from "../../../types/index";

export interface CartDishItem {
  type: "dish";
  dish: DishResponse;
  quantity: number;
}

export interface CartMenuItem {
  type: "menu";
  menu: DailyMenuResponse;
  price: number;
  quantity: number;
}

export type CartItem = CartDishItem | CartMenuItem;

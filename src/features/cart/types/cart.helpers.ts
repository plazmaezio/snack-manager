import type { CartItem } from "./cart.types";

export const getItemKey = (item: CartItem) => item.dish.id;

export const getItemName = (item: CartItem) => item.dish.name;

export const getItemPrice = (item: CartItem) => item.dish.price;

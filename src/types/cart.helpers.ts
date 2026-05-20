import type { CartItem } from "./cart.types";
import type { DishResponse } from "./index";

export const getItemKey = (item: CartItem) =>
  item.type === "dish" ? item.dish.id : item.menu.id;

export const getItemName = (item: CartItem) =>
  item.type === "dish" ? item.dish.name : "Daily Menu";

export const getItemPrice = (item: CartItem) =>
  item.type === "dish" ? item.dish.price : item.price;

export const getMenuDishNames = (item: CartItem): string[] => {
  if (item.type !== "menu") return [];
  return [
    item.menu.meatDishName,
    item.menu.fishDishName,
    item.menu.vegetarianDishName,
  ].filter(Boolean) as string[];
};

export const getMenuDishIds = (
  item: CartItem,
  dishes: DishResponse[],
): { name: string; id: string }[] => {
  if (item.type !== "menu") return [];
  return getMenuDishNames(item)
    .map((name) => {
      const dish = dishes.find(
        (d) => d.name.toLowerCase() === name.toLowerCase(),
      );
      return dish ? { name, id: dish.id } : null;
    })
    .filter((item): item is { name: string; id: string } => item !== null);
};

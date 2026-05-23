import { api } from "./api";
import type { DishResponse } from "../../features/inventory/types";

const fetchDishesService = async (): Promise<DishResponse[]> => {
  try {
    return await api.get<DishResponse[]>("/dishes");
  } catch (err) {
    throw new Error("Failed to fetch dishes");
  }
};

const fetchDishImageUrlService = async (
  dish: DishResponse,
): Promise<[string, string]> => {
  try {
    const res = await api.get<{ url: string }>(`/dishes/${dish.id}/image-url`);
    const url = res?.url ?? dish.imageUrl ?? "";
    return [dish.id, url];
  } catch {
    return [dish.id, dish.imageUrl ?? ""];
  }
};

const fetchAndMapDishImages = async (
  dishes: DishResponse[],
): Promise<Record<string, string>> => {
  const entries = await Promise.all(
    dishes.map(async (dish): Promise<[string, string]> => {
      return await fetchDishImageUrlService(dish);
    }),
  );

  return Object.fromEntries(entries);
};

export { fetchDishesService, fetchDishImageUrlService, fetchAndMapDishImages };

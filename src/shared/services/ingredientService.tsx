import { api } from "./api";
import type { IngredientResponse } from "../../features/inventory/types";

const getIngredientsService = async () => {
  try {
    return await api.get<IngredientResponse[]>("/ingredients");
  } catch {
    throw new Error("Failed to fetch ingredients");
  }
};

export { getIngredientsService };

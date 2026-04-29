import { useEffect, useState } from "react";
import type { IngredientResponse, DishResponse } from "../types";
import type { CartItem } from "../types/cart.types";
import { getMenuDishNames } from "../types/cart.helpers";
import { api } from "../services/api";

const separateIngredientsByAllergen = (ingredients: IngredientResponse[]) => ({
  withAllergens: ingredients.filter((i) => i.allergen !== "NONE"),
  withoutAllergens: ingredients.filter((i) => i.allergen === "NONE"),
});

const useCartIngredients = () => {
  const [ingredientMap, setIngredientMap] = useState<
    Map<string, IngredientResponse>
  >(new Map());
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<IngredientResponse[]>("/ingredients")
      .then((response) => {
        const map = new Map(response.map((i) => [i.name.toLowerCase(), i]));
        setIngredientMap(map);
      })
      .catch((err) => console.error("Failed to load ingredients:", err))
      .finally(() => setLoading(false));

    api
      .get<DishResponse[]>("/dishes")
      .then(setDishes)
      .catch((err) => console.error("Failed to load dishes:", err));
  }, []);

  const resolveIngredients = (names: string[]): IngredientResponse[] =>
    names
      .map((name) => ingredientMap.get(name.toLowerCase()))
      .filter((i): i is IngredientResponse => i !== undefined);

  const getDishByName = (name: string): DishResponse | undefined =>
    dishes.find((d) => d.name.toLowerCase() === name.toLowerCase());

  const getMenuIngredients = (
    item: CartItem,
    dishList: DishResponse[],
  ): IngredientResponse[] => {
    if (item.type !== "menu") return [];
    const allIngredients: IngredientResponse[] = [];

    getMenuDishNames(item).forEach((dishName) => {
      const dish = dishList.find(
        (d) => d.name.toLowerCase() === dishName.toLowerCase(),
      );
      if (dish)
        allIngredients.push(...resolveIngredients(dish.ingredientNames));
    });

    const uniqueMap = new Map(allIngredients.map((i) => [i.id, i]));
    return Array.from(uniqueMap.values());
  };

  return {
    loading,
    dishes,
    resolveIngredients,
    getDishByName,
    getMenuIngredients,
    separateIngredientsByAllergen,
  };
};

export default useCartIngredients;

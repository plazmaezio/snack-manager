import { useEffect, useState } from "react";
import { api } from "../../../shared/services/api";
import type { IngredientResponse } from "../../inventory/types";

const useCartIngredients = () => {
  const [ingredientMap, setIngredientMap] = useState<
    Map<string, IngredientResponse>
  >(new Map());
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
  }, []);

  const resolveIngredients = (names: string[]): IngredientResponse[] => {
    const resolved = names
      .map((name) => ingredientMap.get(name.toLowerCase()))
      .filter((i): i is IngredientResponse => i !== undefined);

    return [...new Set(resolved)];
  };

  return {
    loading,
    resolveIngredients,
  };
};

export default useCartIngredients;

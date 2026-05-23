import { useEffect, useState, useMemo } from "react";
import {
  ingredientAllergenOptions,
  ingredientTypeOptions,
} from "../../inventory/types";
import type { DishResponse, IngredientResponse } from "../../inventory/types";
import {
  fetchAndMapDishImages,
  fetchDishesService,
} from "../../../shared/services/dishService";
import { getIngredientsService } from "../../../shared/services/ingredientService";
import MenuHeader from "../components/MenuHeader";
import MenuSearch from "../components/MenuSearch";
import MenuFilters from "../components/MenuFilters";
import MenuGrid from "../components/MenuGrid";

const Menu = () => {
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [ingredientsList, setIngredientsList] = useState<IngredientResponse[]>(
    [],
  );

  const fetchDishes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDishesService();
      setDishes(data);
      const urlMap = await fetchAndMapDishImages(data);
      setImageUrls(urlMap);
    } catch (err) {
      setError("Failed to load menu items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await getIngredientsService();
      setIngredientsList(response);
    } catch (error) {
      console.error("Failed to fetch ingredients:", error);
    }
  };

  useEffect(() => {
    document.title = "Menu - Snack Manager";
    fetchDishes();
    fetchIngredients();
  }, []);

  const filteredDishes = useMemo(() => {
    const ingredientLookup = new Map<
      string,
      { allergen: string; type: string }
    >();

    ingredientsList.forEach((ing) => {
      ingredientLookup.set(ing.name.toLowerCase(), {
        allergen: ing.allergen,
        type: ing.type,
      });
    });

    return dishes.filter((dish) => {
      const matchesSearch = dish.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const dishIngredientDetails = (dish.ingredientNames || [])
        .map((name) => ingredientLookup.get(name.toLowerCase()))
        .filter(Boolean);

      const matchesAllergens =
        selectedAllergens.length === 0 ||
        selectedAllergens.every((allergen) =>
          dishIngredientDetails.every(
            (details) => details!.allergen !== allergen,
          ),
        );

      const matchesTypes =
        selectedTypes.length === 0 ||
        selectedTypes.some((type) =>
          dishIngredientDetails.some((details) => details!.type === type),
        );

      return matchesSearch && matchesAllergens && matchesTypes;
    });
  }, [dishes, searchQuery, selectedAllergens, selectedTypes, ingredientsList]);

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen],
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedAllergens([]);
    setSelectedTypes([]);
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedAllergens.length > 0 || selectedTypes.length > 0,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-80px)]">
      <MenuHeader />

      <MenuSearch value={searchQuery} onChange={setSearchQuery} />

      <MenuFilters
        selectedAllergens={selectedAllergens}
        selectedTypes={selectedTypes}
        onToggleAllergen={toggleAllergen}
        onToggleType={toggleType}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        allergenOptions={ingredientAllergenOptions}
        typeOptions={ingredientTypeOptions}
      />

      <MenuGrid
        loading={loading}
        error={error}
        filteredDishes={filteredDishes}
        totalDishesCount={dishes.length}
        hasActiveFilters={hasActiveFilters}
        imageUrls={imageUrls}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default Menu;

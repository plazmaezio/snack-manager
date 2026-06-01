import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { DishResponse, IngredientResponse } from "../../inventory/types";
import {
  fetchDishesService,
  fetchAndMapDishImages,
} from "../../../shared/services/dishService";
import { getIngredientsService } from "../../../shared/services/ingredientService";
import { formatName } from "../../../shared/utils/nameFormatting";
import { useCart } from "../../cart/contexts/CartContext";

const DishDetail = () => {
  const { dishId } = useParams<{ dishId: string }>();
  const navigate = useNavigate();
  const [dish, setDish] = useState<DishResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [masterIngredients, setMasterIngredients] = useState<
    IngredientResponse[]
  >([]);
  const { addDish } = useCart();

  useEffect(() => {
    document.title = "Dish Details - Snack Manager";
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const [dishes, ingredientsData] = await Promise.all([
          fetchDishesService(),
          getIngredientsService(),
        ]);

        setMasterIngredients(ingredientsData);

        const foundDish = dishes.find((d) => d.id === dishId);
        if (!foundDish) {
          setError("Dish not found");
          return;
        }

        setDish(foundDish);

        const urlMap = await fetchAndMapDishImages([foundDish]);
        setImageUrls(urlMap);
      } catch (err) {
        setError("Failed to load dish details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (dishId) {
      fetchInitialData();
    }
  }, [dishId]);

  const dishAllergens = useMemo(() => {
    if (!dish || !masterIngredients.length) return [];

    const allergenMap = new Map<string, string>();
    masterIngredients.forEach((ing) => {
      if (ing.allergen) {
        allergenMap.set(ing.name.toLowerCase(), ing.allergen);
      }
    });

    const identifiedAllergens = new Set<string>();
    dish.ingredientNames.forEach((name) => {
      const match = allergenMap.get(name.toLowerCase());
      if (match && match.toLowerCase() !== "none") {
        identifiedAllergens.add(match);
      }
    });

    return Array.from(identifiedAllergens);
  }, [dish, masterIngredients]);

  // replace handleAddToCart with:
  const handleAddToCart = () => {
    if (!dish) return;
    addDish(dish, new Date().toISOString().split("T")[0]);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-80px)]">
        <div className="animate-pulse">
          <div className="h-96 bg-form-bg rounded-lg mb-6"></div>
          <div className="h-8 bg-form-bg rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-form-bg rounded w-1/3 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-form-bg rounded w-full"></div>
            <div className="h-4 bg-form-bg rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-80px)]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error || "Dish not found"}</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const finalImageUrl = imageUrls[dish.id] || dish.imageUrl;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-80px)]">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 text-accent hover:opacity-75 transition-opacity font-semibold"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Home
      </button>

      {/* CHANGED: Added items-start to the grid to prevent vertical centering stretching */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Dish Image */}
        {/* CHANGED: changed items-center to items-start so it stays pinned to the top */}
        <div className="flex items-start justify-center w-full">
          <div className="w-full aspect-square rounded-lg overflow-hidden bg-linear-to-br from-accent-bg to-form-bg shadow-lg">
            {finalImageUrl ? (
              <img
                src={finalImageUrl}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-accent opacity-30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Dish Details */}
        {/* REMOVED: justify-between (which forced empty space gaps when content was short) */}
        <div className="flex flex-col h-full justify-start">
          <div>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-heading mb-3">
                {formatName(dish.name)}
              </h1>
              <p className="text-3xl font-bold text-accent">
                €{dish.price.toFixed(2)}
              </p>
            </div>

            {/* List 1: Ingredients */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-heading mb-3">
                Ingredients
              </h2>
              <div className="flex flex-wrap gap-2">
                {dish.ingredientNames.map((ingredient, idx) => (
                  <span key={idx} className="badge-ingredient">
                    {formatName(ingredient)}
                  </span>
                ))}
              </div>
            </div>

            {/* List 2: Allergens */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-heading mb-3">Allergens</h2>
              {dishAllergens.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {dishAllergens.map((allergen, idx) => (
                    <span key={idx} className="badge-allergen">
                      {formatName(allergen)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-main-text opacity-70 italic">
                  No known allergens identified.
                </p>
              )}
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex gap-3 pt-4 mt-auto">
            <button
              onClick={handleAddToCart}
              className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishDetail;

import { useEffect, useState, useMemo } from "react";
import DishCard from "../components/DishCard";
import {
  ingredientAllergenOptions,
  ingredientTypeOptions,
} from "../../inventory/types";
import type {
  DishResponse,
  IngredientAllergen,
  IngredientResponse,
  IngredientType,
} from "../../inventory/types";
import {
  fetchAndMapDishImages,
  fetchDishesService,
} from "../../../shared/services/dishService";
import { getIngredientsService } from "../../../shared/services/ingredientService";
import { Link } from "react-router-dom";

const Menu = () => {
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showAllergenFilter, setShowAllergenFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
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
      { allergen: IngredientAllergen; type: IngredientType }
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

  const hasActiveFilters =
    searchQuery || selectedAllergens.length > 0 || selectedTypes.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-heading mb-2">
          Menu
        </h1>
        <p className="text-main-text">
          Explore our delicious selection of snacks and meals
        </p>
      </div>

      {/* Header Link */}
      <div className="mb-4 relative z-10">
        <Link
          to="/"
          className="text-sm sm:text-base font-semibold text-brand underline hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            View Today's Daily Menu
            <svg
              className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-main-text opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-form-bg border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-heading placeholder-main-text"
          />
        </div>
      </div>

      {/* Filters Area */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Explicitly named: Exclude Allergens */}
          <div className="relative flex-1 sm:flex-none">
            <button
              onClick={() => {
                setShowAllergenFilter(!showAllergenFilter);
                setShowTypeFilter(false);
              }}
              className={`w-full sm:w-auto px-4 py-2 border rounded-lg font-semibold transition-colors flex items-center justify-center sm:justify-start gap-2 ${
                selectedAllergens.length > 0
                  ? "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-form-bg border-ui-border text-heading hover:bg-accent-bg"
              }`}
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Exclude Allergens{" "}
              {selectedAllergens.length > 0 && `(${selectedAllergens.length})`}
            </button>

            {showAllergenFilter && (
              <div className="absolute top-full left-0 mt-2 bg-form-bg border border-ui-border rounded-lg shadow-lg p-4 w-64 z-20 sm:w-72">
                <div className="text-xs font-semibold text-main-text uppercase tracking-wider mb-2">
                  Hide dishes containing:
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {Object.entries(ingredientAllergenOptions)
                    .filter(([key]) => key !== "NONE")
                    .map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 p-2 hover:bg-red-50/50 rounded cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAllergens.includes(key)}
                          onChange={() => toggleAllergen(key)}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-heading text-sm group-hover:text-red-700">
                          {value}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Explicitly named: Include Types */}
          <div className="relative flex-1 sm:flex-none">
            <button
              onClick={() => {
                setShowTypeFilter(!showTypeFilter);
                setShowAllergenFilter(false);
              }}
              className={`w-full sm:w-auto px-4 py-2 border rounded-lg font-semibold transition-colors flex items-center justify-center sm:justify-start gap-2 ${
                selectedTypes.length > 0
                  ? "bg-blue-50 border-blue-300 text-blue-800"
                  : "bg-form-bg border-ui-border text-heading hover:bg-accent-bg"
              }`}
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter by Category{" "}
              {selectedTypes.length > 0 && `(${selectedTypes.length})`}
            </button>

            {showTypeFilter && (
              <div className="absolute top-full left-0 mt-2 bg-form-bg border border-ui-border rounded-lg shadow-lg p-4 w-64 z-20 sm:w-72">
                <div className="text-xs font-semibold text-main-text uppercase tracking-wider mb-2">
                  Show categories:
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {Object.entries(ingredientTypeOptions).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 p-2 hover:bg-blue-50/50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(key)}
                        onChange={() => toggleType(key)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-heading text-sm">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Visual Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-main-text uppercase mr-1">
            Active Rules:
          </span>

          {/* Amber/Red badging for explicit exclusions */}
          {selectedAllergens.map((allergen) => (
            <div
              key={allergen}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-sm text-amber-800"
            >
              <span className="font-medium">
                No{" "}
                {
                  ingredientAllergenOptions[
                    allergen as keyof typeof ingredientAllergenOptions
                  ]
                }
              </span>
              <button
                onClick={() => toggleAllergen(allergen)}
                className="text-amber-500 hover:text-amber-800 font-bold ml-1 text-base leading-none"
              >
                &times;
              </button>
            </div>
          ))}

          {/* Blue badging for inclusive categories */}
          {selectedTypes.map((type) => (
            <div
              key={type}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-800"
            >
              <span className="font-medium">
                {
                  ingredientTypeOptions[
                    type as keyof typeof ingredientTypeOptions
                  ]
                }
              </span>
              <button
                onClick={() => toggleType(type)}
                className="text-blue-500 hover:text-blue-800 font-bold ml-1 text-base leading-none"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-56 bg-form-bg rounded-lg mb-4"></div>
              <div className="h-6 bg-form-bg rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-form-bg rounded w-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredDishes.length === 0 && (
        <div className="text-center py-16">
          <svg
            className="w-16 h-16 mx-auto text-main-text opacity-30 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-2xl font-bold text-heading mb-2">
            No dishes found
          </h3>
          <p className="text-main-text mb-6">
            {hasActiveFilters
              ? "Try adjusting your search query or loosening your filters."
              : "Come back later for more delicious options!"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Dishes Grid */}
      {!loading && !error && filteredDishes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => {
            const fallbackUrl = imageUrls[dish.id] || dish.imageUrl || "";
            return (
              <DishCard key={dish.id} dish={dish} imageUrl={fallbackUrl} />
            );
          })}
        </div>
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="mt-8 text-center text-main-text text-sm">
          Showing <strong>{filteredDishes.length}</strong> of{" "}
          <strong>{dishes.length}</strong> dishes
        </div>
      )}
    </div>
  );
};

export default Menu;

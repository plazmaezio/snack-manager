import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Loader,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { CartItem } from "../types/cart.types";
import type { IngredientResponse, DishResponse } from "../types";
import { ingredientAllergenOptions } from "../types";
import { api } from "../services/api";

// ─── helpers ────────────────────────────────────────────────────────────────

const getItemKey = (item: CartItem) =>
  item.type === "dish" ? item.dish.id : item.menu.id;

const getItemName = (item: CartItem) =>
  item.type === "dish" ? item.dish.name : `Daily Menu`;

const getItemPrice = (item: CartItem) =>
  item.type === "dish" ? item.dish.price : item.price;

const getMenuDishNames = (item: CartItem) => {
  if (item.type !== "menu") return [];
  return [
    item.menu.meatDishName,
    item.menu.fishDishName,
    item.menu.vegetarianDishName,
  ].filter(Boolean) as string[];
};

const getMenuDishIds = (
  item: CartItem,
  dishes: DishResponse[],
): { name: string; id: string }[] => {
  if (item.type !== "menu") return [];
  const menuDishNames = getMenuDishNames(item);
  const allDishes = [...dishes, ...MOCK_DISHES];
  return menuDishNames
    .map((name) => {
      const dish = allDishes.find(
        (d) => d.name.toLowerCase() === name.toLowerCase(),
      );
      return dish ? { name, id: dish.id } : null;
    })
    .filter((item): item is { name: string; id: string } => item !== null);
};

// ─── sub-components ──────────────────────────────────────────────────────────

const AllergenBadges = ({
  ingredients,
}: {
  ingredients: IngredientResponse[];
}) => {
  const allergens = ingredients
    .filter((i) => i.allergen !== "NONE")
    .map((i) => ingredientAllergenOptions[i.allergen]);

  if (allergens.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 mt-1">
      <span className="text-xs text-brand font-semibold uppercase tracking-wide">
        Allergens:
      </span>
      <ul className="space-y-1">
        {allergens.map((a) => (
          <li
            key={a}
            className="text-xs pl-3 border-l-2 border-yellow-500 text-yellow-700"
          >
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
};

const IngredientList = ({
  ingredients,
}: {
  ingredients: IngredientResponse[];
}) => (
  <ul className="space-y-1 mt-2">
    {ingredients.map((ingredient) => {
      const hasAllergen = ingredient.allergen !== "NONE";
      return (
        <li key={ingredient.id} className="text-xs flex items-center gap-1.5">
          {hasAllergen && <span className="font-bold text-yellow-600">!</span>}
          <span className="text-main-text">
            {ingredient.name}
            {hasAllergen && (
              <span className="text-yellow-700">
                {" "}
                ({ingredientAllergenOptions[ingredient.allergen]})
              </span>
            )}
          </span>
        </li>
      );
    })}
  </ul>
);

// Helper to separate ingredients by allergen status
const separateIngredientsByAllergen = (
  ingredients: IngredientResponse[],
): {
  withAllergens: IngredientResponse[];
  withoutAllergens: IngredientResponse[];
} => {
  return {
    withAllergens: ingredients.filter((i) => i.allergen !== "NONE"),
    withoutAllergens: ingredients.filter((i) => i.allergen === "NONE"),
  };
};

// ─── mock dishes for testing ─────────────────────────────────────────────────

const MOCK_DISHES = [
  {
    id: "mock-1",
    name: "Grilled Chicken",
    ingredientNames: ["Chicken", "Garlic", "Lemon"],
    price: 8.99,
    imageUrl: "",
  },
  {
    id: "mock-2",
    name: "Baked Salmon",
    ingredientNames: ["Salmon", "Lemon", "Herbs"],
    price: 12.99,
    imageUrl: "",
  },
  {
    id: "mock-3",
    name: "Caesar Salad",
    ingredientNames: ["Lettuce", "Croutons", "Parmesan"],
    price: 8.99,
    imageUrl: "",
  },
];

// ─── main component ──────────────────────────────────────────────────────────

const CartPreview = () => {
  const { cartItems, removeItem, updateQuantity, cartTotal, addDish } =
    useCart();
  const [mounted, setMounted] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [localQuantities, setLocalQuantities] = useState<Map<string, number>>(
    new Map(),
  );
  const [updatingTimers, setUpdatingTimers] = useState<Map<string, number>>(
    new Map(),
  );

  // ingredients map: name → IngredientResponse
  const [ingredientMap, setIngredientMap] = useState<
    Map<string, IngredientResponse>
  >(new Map());
  const [loadingIngredients, setLoadingIngredients] = useState(false);

  // dishes list for menu ingredient lookup
  const [dishes, setDishes] = useState<DishResponse[]>([]);

  useEffect(() => {
    document.title = "Shopping Cart - Snack Manager";
    setMounted(true);

    setLoadingIngredients(true);
    api
      .get<IngredientResponse[]>("/ingredients")
      .then((response) => {
        const map = new Map(response.map((i) => [i.name.toLowerCase(), i]));
        setIngredientMap(map);
      })
      .catch((err) => console.error("Failed to load ingredients:", err))
      .finally(() => setLoadingIngredients(false));

    // Fetch dishes for menu ingredient lookup
    api
      .get<DishResponse[]>("/dishes")
      .then(setDishes)
      .catch((err) => console.error("Failed to load dishes:", err));

    return () => {
      updatingTimers.forEach((t) => clearTimeout(t));
    };
  }, []);

  if (!mounted) return null;

  const toggleExpand = (id: string) => {
    const next = new Set(expandedItems);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedItems(next);
  };

  const resolveIngredients = (names: string[]): IngredientResponse[] =>
    names
      .map((name) => ingredientMap.get(name.toLowerCase()))
      .filter((i): i is IngredientResponse => i !== undefined);

  const getDishByName = (dishName: string): DishResponse | undefined => {
    // Search in fetched dishes first, then fall back to mock dishes
    const allDishes = [...dishes, ...MOCK_DISHES];
    return allDishes.find(
      (d) => d.name.toLowerCase() === dishName.toLowerCase(),
    );
  };

  const getMenuIngredients = (item: CartItem): IngredientResponse[] => {
    if (item.type !== "menu") return [];
    const menuDishNames = getMenuDishNames(item);
    const allIngredients: IngredientResponse[] = [];

    menuDishNames.forEach((dishName) => {
      const dish = getDishByName(dishName);
      if (dish) {
        const dishIngredients = resolveIngredients(dish.ingredientNames);
        allIngredients.push(...dishIngredients);
      }
    });

    // Remove duplicates by id
    const uniqueMap = new Map<string, IngredientResponse>();
    allIngredients.forEach((ing) => {
      uniqueMap.set(ing.id, ing);
    });
    return Array.from(uniqueMap.values());
  };

  const getDisplayQuantity = (id: string, current: number) =>
    localQuantities.has(id) ? localQuantities.get(id)! : current;

  const isUpdating = updatingTimers.size > 0;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLocalQuantities((prev) => new Map(prev).set(itemId, newQuantity));

    const existingTimer = updatingTimers.get(itemId);
    if (existingTimer) clearTimeout(existingTimer);

    const newTimer = setTimeout(() => {
      updateQuantity(itemId, newQuantity);
      setUpdatingTimers((prev) => {
        const updated = new Map(prev);
        updated.delete(itemId);
        return updated;
      });
    }, 500);

    setUpdatingTimers((prev) => new Map(prev).set(itemId, newTimer));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-brand hover:opacity-80 transition-opacity mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-heading">Shopping Cart</h1>
      </div>

      {/* Test buttons */}
      <div className="flex gap-3 mb-6">
        {MOCK_DISHES.map((dish) => (
          <button
            key={dish.id}
            onClick={() => addDish(dish)}
            className="px-4 py-2 border border-dashed border-brand text-brand text-sm rounded-md hover:bg-brand hover:text-white transition-colors"
          >
            + Add "{dish.name}" (test)
          </button>
        ))}
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-main-bg border border-ui-border rounded-lg p-12 text-center">
          <p className="text-lg text-main-text mb-4">Your cart is empty</p>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-brand text-white rounded-md hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {loadingIngredients && (
              <div className="flex items-center gap-2 text-sm text-main-text opacity-60 mb-2">
                <Loader className="w-3 h-3 animate-spin" />
                Loading allergen info...
              </div>
            )}

            {cartItems.map((item) => {
              const key = getItemKey(item);
              const isExpanded = expandedItems.has(key);
              const displayQty = getDisplayQuantity(key, item.quantity);

              const resolvedIngredients =
                item.type === "dish"
                  ? resolveIngredients(item.dish.ingredientNames)
                  : [];

              const menuDishNames = getMenuDishNames(item);
              const menuIngredients =
                item.type === "menu" ? getMenuIngredients(item) : [];

              return (
                <div
                  key={key}
                  className="bg-main-bg border border-ui-border rounded-lg overflow-hidden hover:border-brand transition-colors"
                >
                  {/* Item header */}
                  <div className="p-4 flex gap-4 items-start">
                    <button
                      onClick={() => toggleExpand(key)}
                      className="shrink-0 text-brand hover:opacity-80 transition-opacity pt-1"
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold">
                        {item.type === "dish" ? (
                          <Link
                            to={`/menu/${item.dish.id}`}
                            className="hover:underline transition-colors"
                          >
                            {getItemName(item)}
                          </Link>
                        ) : (
                          getItemName(item)
                        )}
                      </h3>

                      {/* Allergen summary under name */}
                      {item.type === "dish" && !loadingIngredients && (
                        <AllergenBadges ingredients={resolvedIngredients} />
                      )}
                      {item.type === "menu" && (
                        <div>
                          <p className="text-xs text-main-text mt-1 opacity-70 mb-1">
                            {getMenuDishIds(item, dishes).map(
                              ({ name, id }, idx) => (
                                <span key={id}>
                                  <Link
                                    to={`/menu/${id}`}
                                    className="hover:underline transition-colors"
                                  >
                                    {name}
                                  </Link>
                                  {idx <
                                    getMenuDishIds(item, dishes).length - 1 &&
                                    " · "}
                                </span>
                              ),
                            )}
                          </p>
                          {!loadingIngredients && (
                            <AllergenBadges ingredients={menuIngredients} />
                          )}
                        </div>
                      )}

                      <p className="text-lg font-bold text-brand mt-2">
                        {getItemPrice(item).toFixed(2)}€ each
                      </p>
                    </div>

                    {/* Quantity + remove */}
                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() => removeItem(key)}
                        className="p-2 rounded transition-colors text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-2 rounded-md bg-form-bg">
                        <button
                          onClick={() =>
                            handleQuantityChange(key, displayQty - 1)
                          }
                          disabled={displayQty <= 1}
                          className="p-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded hover:bg-brand/20 hover:text-brand"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 font-bold text-sm min-w-10 text-center text-brand">
                          {displayQty}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(key, displayQty + 1)
                          }
                          className="p-1 transition-all rounded hover:bg-brand/20 hover:text-brand"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 ml-9 space-y-3 border-t border-ui-border pt-3">
                      {item.type === "dish" && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-brand opacity-80">
                            Ingredients
                          </p>
                          {loadingIngredients ? (
                            <div className="flex items-center gap-2 text-xs opacity-50">
                              <Loader className="w-3 h-3 animate-spin" />{" "}
                              Loading...
                            </div>
                          ) : (
                            <IngredientList ingredients={resolvedIngredients} />
                          )}
                        </div>
                      )}

                      {item.type === "menu" && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-brand opacity-80">
                            Includes
                          </p>
                          <ul className="space-y-3">
                            {menuDishNames.map((dishName) => {
                              const dish = getDishByName(dishName);
                              const dishIngredients = dish
                                ? resolveIngredients(dish.ingredientNames)
                                : [];
                              const { withAllergens, withoutAllergens } =
                                separateIngredientsByAllergen(dishIngredients);

                              return (
                                <li
                                  key={dishName}
                                  className="space-y-1.5 border-l-2 border-brand pl-3"
                                >
                                  <p className="text-sm font-medium text-main-text">
                                    {dishName}
                                  </p>

                                  {/* Ingredients with allergens */}
                                  {withAllergens.length > 0 && (
                                    <p className="text-xs text-yellow-700">
                                      {withAllergens
                                        .map(
                                          (i) =>
                                            `! ${i.name} (${ingredientAllergenOptions[i.allergen]})`,
                                        )
                                        .join(", ")}
                                    </p>
                                  )}

                                  {/* Ingredients without allergens */}
                                  {withoutAllergens.length > 0 && (
                                    <p className="text-xs text-main-text opacity-80">
                                      {withoutAllergens
                                        .map((i) => i.name)
                                        .join(", ")}
                                    </p>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Subtotal */}
                  <div className="px-4 py-3 border-t border-ui-border text-right bg-form-bg">
                    <p className="text-sm flex items-center justify-end gap-2 text-main-text">
                      Subtotal:{" "}
                      <span className="font-bold text-brand">
                        {(getItemPrice(item) * item.quantity).toFixed(2)}€
                      </span>
                      {isUpdating && (
                        <Loader className="w-3 h-3 animate-spin text-brand" />
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-main-bg border border-ui-border rounded-lg p-6 sticky top-20">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-4 text-heading">
                Order Summary
              </h2>
              <div className="space-y-2 sm:space-y-3 mb-6 pb-6 border-b border-ui-border">
                {/* List all items */}
                <div className="space-y-1 sm:space-y-2 max-h-64 overflow-y-auto">
                  {/* Header row */}
                  <div className="text-xs font-semibold text-main-text opacity-70 grid grid-cols-3 gap-1 pb-2 border-b border-ui-border">
                    <div className="col-span-1">Item</div>
                    <div className="text-center">Qty</div>
                    <div className="text-right">Subtotal</div>
                  </div>

                  {/* Items */}
                  {cartItems.map((item) => (
                    <div
                      key={getItemKey(item)}
                      className="text-xs sm:text-sm grid grid-cols-3 gap-1 items-start"
                    >
                      <div className="col-span-1 min-w-0">
                        <span className="font-medium text-main-text">
                          {getItemName(item)}
                        </span>
                      </div>
                      <div className="text-center font-semibold text-brand">
                        {item.quantity}
                      </div>
                      <div className="text-right font-semibold text-brand">
                        {(getItemPrice(item) * item.quantity).toFixed(2)}€
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-2 border-t border-ui-border flex justify-between items-center">
                  <span className="font-bold text-heading text-sm sm:text-base lg:text-lg">
                    Total:
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-bold text-brand text-base sm:text-lg lg:text-xl">
                      {cartTotal.toFixed(2)}€
                    </span>
                    {isUpdating && (
                      <Loader className="w-4 h-4 animate-spin text-brand" />
                    )}
                  </span>
                </div>
              </div>

              <button className="w-full px-4 py-3 bg-brand text-white font-semibold rounded-md hover:opacity-90 transition-opacity mb-3">
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block w-full px-4 py-2 border border-ui-border text-center font-medium rounded-md text-main-text transition-colors hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPreview;

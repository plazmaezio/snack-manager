import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import CartItemCard from "../components/cart/CartItemCard";
import CartOrderSummary from "../components/cart/CartOrderSummary";
import { getItemKey } from "../types/cart.helpers";
import useCartIngredients from "../hooks/useCartIngredients";

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

const CartPreview = () => {
  const { cartItems, removeItem, updateQuantity, cartTotal, addDish } =
    useCart();
  const {
    loading,
    dishes,
    resolveIngredients,
    getDishByName,
    getMenuIngredients,
    separateIngredientsByAllergen,
  } = useCartIngredients();

  const [localQuantities, setLocalQuantities] = useState<Map<string, number>>(
    new Map(),
  );
  const [updatingTimers, setUpdatingTimers] = useState<Map<string, number>>(
    new Map(),
  );

  useEffect(() => {
    document.title = "Shopping Cart - Snack Manager";
    return () => {
      updatingTimers.forEach((t) => clearTimeout(t));
    };
  }, []);

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

      {loading && (
        <div className="flex items-center gap-2 text-sm text-main-text opacity-60 mb-4">
          <Loader className="w-3 h-3 animate-spin" />
          Loading allergen info...
        </div>
      )}

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
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const key = getItemKey(item);
              // merge real dishes with mocks before passing down
              const allDishes = [...dishes, ...MOCK_DISHES];
              return (
                <CartItemCard
                  key={key}
                  item={item}
                  dishes={allDishes}
                  resolveIngredients={resolveIngredients}
                  getDishByName={getDishByName}
                  separateIngredientsByAllergen={separateIngredientsByAllergen}
                  menuIngredients={
                    item.type === "menu"
                      ? getMenuIngredients(item, allDishes)
                      : []
                  }
                  loadingIngredients={loading}
                  isUpdating={isUpdating}
                  onRemove={removeItem}
                  onQuantityChange={handleQuantityChange}
                  displayQuantity={getDisplayQuantity(key, item.quantity)}
                />
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <CartOrderSummary
              cartItems={cartItems}
              cartTotal={cartTotal}
              isUpdating={isUpdating}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPreview;

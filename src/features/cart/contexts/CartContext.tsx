import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "../types";
import type { DishResponse } from "../../inventory/types";

interface CartContextType {
  cartItems: CartItem[];
  addDish: (dish: DishResponse, date: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  cartTotal: number;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addDish = (dish: DishResponse, date: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);

      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { dish, quantity: 1, date }];
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.dish.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.dish.id === id ? { ...item, quantity } : item)),
    );
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0,
  );

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addDish,
        removeItem,
        updateQuantity,
        cartTotal,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

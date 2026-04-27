import { createContext, useContext, useEffect, useState } from "react";
import type {
  DishResponse,
  DailyMenuResponse,
  CartItem,
  CartDishItem,
  CartMenuItem,
} from "../types";

interface CartContextType {
  cartItems: CartItem[];
  addDish: (dish: DishResponse) => void;
  addMenu: (menu: DailyMenuResponse, price: number) => void;
  removeItem: (id: string) => void;
  cartTotal: number;
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

  const addDish = (dish: DishResponse) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.type === "dish" && item.dish.id === dish.id,
      ) as CartDishItem | undefined;

      if (existing) {
        return prev.map((item) =>
          item.type === "dish" && item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { type: "dish", dish, quantity: 1 }];
    });
  };

  const addMenu = (menu: DailyMenuResponse, price: number) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.type === "menu" && item.menu.id === menu.id,
      ) as CartMenuItem | undefined;

      if (existing) {
        return prev.map((item) =>
          item.type === "menu" && item.menu.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { type: "menu", menu, price, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) =>
      prev.filter((item) =>
        item.type === "dish" ? item.dish.id !== id : item.menu.id !== id,
      ),
    );
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.type === "dish" ? item.dish.price : item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addDish, addMenu, removeItem, cartTotal }}
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

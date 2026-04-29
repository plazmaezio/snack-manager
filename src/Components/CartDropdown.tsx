import type { CartItem } from "../types/cart.types";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface CartDropdownProps {
  cartItems: CartItem[];
  cartTotal: number;
}

const getItemKey = (item: CartItem) =>
  item.type === "dish" ? item.dish.id : item.menu.id;

const getItemName = (item: CartItem) =>
  item.type === "dish" ? item.dish.name : `Daily Menu`;

const getItemPrice = (item: CartItem) =>
  item.type === "dish"
    ? item.dish.price * item.quantity
    : item.price * item.quantity;

const CartDropdown = ({ cartItems, cartTotal }: CartDropdownProps) => {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative group">
      <Link
        to="/cart"
        className="flex items-center gap-2 px-3 py-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        <span className="text-sm font-medium">${cartTotal.toFixed(2)}</span>
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-brand text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalQuantity}
          </span>
        )}
      </Link>

      {/* Cart Dropdown */}
      <div className="absolute right-0 mt-2 w-64 bg-main-bg border border-ui-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <div className="p-4">
          {cartItems.length > 0 ? (
            <>
              <div className="space-y-2">
                {cartItems.map((item, index) => (
                  <div
                    key={getItemKey(item)}
                    className={`flex justify-between items-center pb-2 ${
                      index < cartItems.length - 1
                        ? "border-b border-ui-border"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm">{getItemName(item)}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${getItemPrice(item).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t-2 border-ui-border">
                <p className="flex justify-between font-bold mb-3">
                  <span>Total:</span>
                  <span className="text-brand">${cartTotal.toFixed(2)}</span>
                </p>
                <Link
                  to="/cart"
                  className="block w-full px-3 py-2 bg-brand text-white text-center text-sm font-semibold rounded hover:opacity-90 transition-opacity"
                >
                  View Cart
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 text-sm">Cart is empty</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;

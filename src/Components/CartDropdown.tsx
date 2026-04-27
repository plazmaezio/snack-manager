import type { CartItem } from "../types";
import { ShoppingCart } from "lucide-react";

interface CartDropdownProps {
  cartItems: CartItem[];
  cartTotal: number;
}

const getItemKey = (item: CartItem) =>
  item.type === "dish" ? item.dish.id : item.menu.id;

const getItemName = (item: CartItem) =>
  item.type === "dish" ? item.dish.name : `Menu – ${item.menu.date}`;

const getItemPrice = (item: CartItem) =>
  item.type === "dish"
    ? item.dish.price * item.quantity
    : item.price * item.quantity;

const CartDropdown = ({ cartItems, cartTotal }: CartDropdownProps) => {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors">
        <ShoppingCart className="w-4 h-4" />
        <span className="text-sm font-medium">${cartTotal.toFixed(2)}</span>
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-brand text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </button>
      {/* Cart Dropdown */}
      <div className="absolute right-0 mt-2 w-64 bg-main-bg border border-ui-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <div className="p-4">
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <div
                  key={getItemKey(item)}
                  className="flex justify-between items-center mb-2 pb-2 border-b border-ui-border last:border-b-0"
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
              <div className="mt-3 pt-3 border-t border-ui-border">
                <p className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-brand">${cartTotal.toFixed(2)}</span>
                </p>
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

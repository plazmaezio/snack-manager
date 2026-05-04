import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import type { CartItem } from "../../types";
import {
  getItemKey,
  getItemName,
  getItemPrice,
} from "../../types/cart.helpers";

interface CartOrderSummaryProps {
  cartItems: CartItem[];
  cartTotal: number;
  isUpdating: boolean;
}

const CartOrderSummary = ({
  cartItems,
  cartTotal,
  isUpdating,
}: CartOrderSummaryProps) => (
  <div className="bg-main-bg border border-ui-border rounded-lg p-6 sticky top-20">
    <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-4 text-heading">
      Order Summary
    </h2>

    <div className="space-y-2 sm:space-y-3 mb-6 pb-6 border-b border-ui-border">
      <div className="space-y-1 sm:space-y-2 max-h-64 overflow-y-auto">
        <div className="text-xs font-semibold text-main-text opacity-70 grid grid-cols-3 gap-1 pb-2 border-b border-ui-border">
          <div className="col-span-1">Item</div>
          <div className="text-center">Qty</div>
          <div className="text-right">Subtotal</div>
        </div>

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

      <div className="pt-2 border-t border-ui-border flex justify-between items-center">
        <span className="font-bold text-heading text-sm sm:text-base lg:text-lg">
          Total:
        </span>
        <span className="flex items-center gap-2">
          <span className="font-bold text-brand text-base sm:text-lg lg:text-xl">
            {cartTotal.toFixed(2)}€
          </span>
          {isUpdating && <Loader className="w-4 h-4 animate-spin text-brand" />}
        </span>
      </div>
    </div>

    <button className="w-full px-4 py-3 bg-brand text-white font-semibold rounded-md hover:opacity-90 transition-opacity mb-3">
      Proceed to Checkout
    </button>

    <Link
      to="/"
      className="block w-full px-4 py-2 border border-ui-border text-center font-medium rounded-md text-main-text transition-colors hover:bg-brand-bg"
    >
      Continue Shopping
    </Link>
  </div>
);

export default CartOrderSummary;

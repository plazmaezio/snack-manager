import { useNavigate } from "react-router-dom";
import type { DishResponse, UserResponse } from "../types";
import MobileNavLinks from "./MobileNavLinks";
import { Pencil, ShoppingCart, LogOut, Plus } from "lucide-react";

interface CartItem {
  dish: DishResponse;
  quantity: number;
}

interface MobileMenuProps {
  isOpen: boolean;
  user: UserResponse | null;
  cartItems: CartItem[];
  cartTotal: number;
  onClose: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

const MobileMenu = ({
  isOpen,
  user,
  cartItems,
  cartTotal,
  onClose,
  onLogin,
  onLogout,
}: MobileMenuProps) => {
  if (!isOpen) return null;

  const navigate = useNavigate();

  return (
    <div className="md:hidden bg-main-bg border-t border-ui-border">
      <div className="px-4 py-4 space-y-3">
        {/* Navigation Links */}
        <MobileNavLinks onClose={onClose} />

        {/* Cart Mobile */}
        {user && (
          <button className="w-full text-left px-4 py-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Cart - ${cartTotal.toFixed(2)}</span>
            {cartItems.length > 0 && (
              <span className="ml-2 bg-brand text-white text-xs font-bold rounded-full px-2 py-1">
                {cartItems.length}
              </span>
            )}
          </button>
        )}

        {/* Auth Buttons Mobile */}
        {!user ? (
          <div className="space-y-2">
            <button
              onClick={() => {
                onLogin();
                onClose();
              }}
              className="w-full px-4 py-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors font-medium"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="px-4 py-2 font-semibold text-heading">
              Hello, {user?.username}!
            </p>
            {user.type === "ADMIN" && (
              <button
                onClick={() => {
                  navigate("/create-account");
                }}
                className="w-full text-left px-4 py-2 hover:bg-brand-bg rounded-md transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Account
              </button>
            )}
            <button className="w-full text-left px-4 py-2 hover:bg-brand-bg rounded-md transition-colors flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-brand-bg rounded-md transition-colors flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Purchases
            </button>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full text-left px-4 py-2 hover:bg-brand-bg rounded-md transition-colors text-brand font-medium flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;

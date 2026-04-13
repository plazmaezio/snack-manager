import type { UserResponse } from "../types";
import type { DishResponse } from "../types";
import MobileNavLinks from "./MobileNavLinks";

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
  onSignup: () => void;
  onLogout: () => void;
}

const MobileMenu = ({
  isOpen,
  user,
  cartItems,
  cartTotal,
  onClose,
  onLogin,
  onSignup,
  onLogout,
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-main-bg border-t border-ui-border">
      <div className="px-4 py-4 space-y-3">
        {/* Navigation Links */}
        <MobileNavLinks onClose={onClose} />

        {/* Cart Mobile */}
        {user && (
          <button className="w-full text-left px-4 py-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors">
            <span>🛒 Cart - ${cartTotal.toFixed(2)}</span>
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
            <button
              onClick={() => {
                onSignup();
                onClose();
              }}
              className="w-full px-4 py-2 bg-brand text-white rounded-md hover:opacity-90 transition-opacity font-medium"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="px-4 py-2 font-semibold text-heading">
              Hello, {user?.username}!
            </p>
            <button className="w-full text-left px-4 py-2 hover:bg-brand-bg rounded-md transition-colors">
              📝 Edit Profile
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-brand-bg rounded-md transition-colors">
              🛍️ Purchases
            </button>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full text-left px-4 py-2 hover:bg-brand-bg rounded-md transition-colors text-brand font-medium"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;

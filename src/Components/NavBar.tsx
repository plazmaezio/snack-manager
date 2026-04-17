import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import type { DishResponse } from "../types";
import { useAuth } from "../contexts/AuthContext";
import CartDropdown from "./CartDropdown";
import ThemeToggle from "./ThemeToggle";
import UserDropdown from "./UserDropdown";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  interface CartItem {
    dish: DishResponse;
    quantity: number;
  }

  // Mock data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      dish: {
        id: "1",
        name: "Chips",
        ingredientNames: ["Potatoes", "Salt"],
        price: 2.5,
        imageUrl: "https://via.placeholder.com/150",
      },
      quantity: 2,
    },
    {
      dish: {
        id: "2",
        name: "Cookie",
        ingredientNames: ["Flour", "Sugar"],
        price: 1.5,
        imageUrl: "https://via.placeholder.com/150",
      },
      quantity: 1,
    },
  ]);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0,
  );

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-nav-bg border-b border-brand-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-brand">
            🍿 SnackManager
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && <NavLinks />}

            {user && (
              <CartDropdown cartItems={cartItems} cartTotal={cartTotal} />
            )}

            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            {/* Auth Section */}
            {user && <UserDropdown user={user} onLogout={handleLogout} />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        user={user}
        cartItems={cartItems}
        cartTotal={cartTotal}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </nav>
  );
};

export default NavBar;

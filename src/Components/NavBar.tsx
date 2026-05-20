import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CartDropdown from "./CartDropdown";
import ThemeToggle from "./ThemeToggle";
import UserDropdown from "./UserDropdown";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import { useCart } from "../contexts/CartContext";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems, cartTotal, totalQuantity } = useCart();

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
              <CartDropdown
                cartItems={cartItems}
                cartTotal={cartTotal}
                totalQuantity={totalQuantity}
              />
            )}

            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            {/* Dropdown Section */}
            {user && <UserDropdown user={user} onLogout={handleLogout} />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative p-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors"
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

              {/* Badge indicating the number of items in the cart */}
              {user && !isMobileMenuOpen && totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-nav-bg">
                  {totalQuantity}
                </span>
              )}
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
        totalQuantity={totalQuantity}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </nav>
  );
};

export default NavBar;

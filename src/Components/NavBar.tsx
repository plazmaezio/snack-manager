import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import type { DishResponse } from "../types";
import { useAuth } from "../contexts/AuthContext";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    setIsDropdownOpen(false);
    logout();
    navigate("/");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <nav className="bg-brand-bg border-b border-brand-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-brand">
            🍿 SnackManager
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Home & Menu Links */}
            <div className="flex gap-4">
              <Link
                to="/"
                className="text-main-text hover:text-brand transition-colors font-medium"
              >
                Home
              </Link>
              <a
                href="#menu"
                className="text-main-text hover:text-brand transition-colors font-medium"
              >
                Menu
              </a>
            </div>

            {/* Cart */}
            {user && (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors">
                  <span>🛒</span>
                  <span className="text-sm font-medium">
                    ${cartTotal.toFixed(2)}
                  </span>
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
                            key={item.dish.id}
                            className="flex justify-between items-center mb-2 pb-2 border-b border-ui-border last:border-b-0"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {item.dish.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ${(item.dish.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                        <div className="mt-3 pt-3 border-t border-ui-border">
                          <p className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span className="text-brand">
                              ${cartTotal.toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-gray-500 text-sm">
                        Cart is empty
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {/* Auth Section */}
            {!user ? (
              <div className="flex gap-2">
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors font-medium"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="px-4 py-2 bg-brand text-white rounded-md hover:opacity-90 transition-opacity font-medium"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors font-medium"
                >
                  <span className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                  <span>{user?.username}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-main-bg border border-ui-border rounded-md shadow-lg">
                    <div className="p-4 border-b border-ui-border">
                      <p className="text-sm font-semibold text-heading">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.type === "ADMIN"
                          ? "Admin"
                          : user?.type === "EMPLOYEE"
                            ? "Employee"
                            : "Client"}{" "}
                        {user?.balance !== undefined &&
                          `| Balance: $${
                            user.balance % 1 === 0
                              ? user.balance.toFixed(1)
                              : Number(user.balance.toString()).toFixed(2)
                          }`}
                      </p>
                    </div>
                    <button className="w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors">
                      📝 Edit Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors">
                      🛍️ Purchases
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors text-brand font-medium"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {/* Hamburger Menu */}
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
      {isMobileMenuOpen && (
        <div className="md:hidden bg-main-bg border-t border-ui-border">
          <div className="px-4 py-4 space-y-3">
            {/* Navigation Links */}
            <Link
              to="/"
              className="block px-4 py-2 text-main-text hover:bg-brand-bg rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="#menu"
              className="block px-4 py-2 text-main-text hover:bg-brand-bg rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Menu
            </a>

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
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    handleSignup();
                    setIsMobileMenuOpen(false);
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
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-brand-bg rounded-md transition-colors text-brand font-medium"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

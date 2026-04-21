import { useEffect, useState } from "react";
import type { UserResponse } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Pencil, ShoppingCart, LogOut } from "lucide-react";

interface UserDropdownProps {
  user: UserResponse;
  onLogout: () => void;
}

const UserDropdown = ({ user, onLogout }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userType =
    user?.type === "ADMIN"
      ? "Admin"
      : user?.type === "EMPLOYEE"
        ? "Employee"
        : "Client";

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors font-medium"
      >
        <span className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-sm font-bold">
          {user?.username.charAt(0).toUpperCase()}
        </span>
        <span>{user?.username}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-main-bg border border-ui-border rounded-md shadow-lg">
          <div className="p-4 border-b border-ui-border">
            <p className="text-sm font-semibold text-heading">
              {user?.username}
            </p>
            <p className="text-xs text-gray-500">
              {userType}
              {user?.balance !== undefined &&
                ` | Balance: $${
                  user.balance % 1 === 0
                    ? user.balance.toFixed(1)
                    : Number(user.balance.toString()).toFixed(2)
                }`}
            </p>
          </div>
          {user.type === "ADMIN" && (
            <button
              onClick={() => {
                navigate("/create-account");
              }}
              className="w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Account
            </button>
          )}
          <button
            onClick={() => {
              navigate("/edit-profile");
            }}
            className="w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
          <button
            onClick={() => {
              navigate("/my-purchases");
            }}
            className="w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Purchases
          </button>
          <button
            onClick={() => {
              onLogout();
            }}
            className="w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors text-brand font-medium flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

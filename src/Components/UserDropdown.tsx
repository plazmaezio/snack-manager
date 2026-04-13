import { useState } from "react";
import type { UserResponse } from "../types";

interface UserDropdownProps {
  user: UserResponse;
  onLogout: () => void;
}

const UserDropdown = ({ user, onLogout }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const userType =
    user?.type === "ADMIN"
      ? "Admin"
      : user?.type === "EMPLOYEE"
        ? "Employee"
        : "Client";

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
          <button className="w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors">
            📝 Edit Profile
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors">
            🛍️ Purchases
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors text-brand font-medium"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
